'use client';

import { useState, useMemo, useEffect } from 'react';
import PocketBase from 'pocketbase';

import { RevenueForm } from '../../components/RevenueForm';

interface TaxBracket {
  minIncome: number;
  maxIncome: number;
  taxRate: number;
}

interface Revenue {
  type: string;
  frequency: string;
  state: string;
  income: number;
}

export default function TaxPage() {
  const [frequencyDisplay, setFequencyDisplay] = useState('Monthly');
  const [filingStatus, setFilingStatus] = useState('S');
  const [deductions, setDeductions] = useState(13850);
  const [revenues, setRevenues] = useState<Revenue[]>([]);

  // Define the tax brackets for federal and state
  const [bracketsFed, setBracketsFed] = useState<TaxBracket[]>([]);
  const [bracketsStates, setBracketsStates] = useState<{
    [state: string]: TaxBracket[];
  }>({});

  // Fetch the tax brackets from the database based on the filing status
  useEffect(() => {
    // Create an instance of PocketBase
    const pb = new PocketBase('http://127.0.0.1:8090');
    const year = 2023;

    const fetchFedTaxBrackets = async () => {
      const filter = `jurisdiction = "Federal" && filing_status="${filingStatus}" && year=${year}`;

      const result = await pb.collection('brackets').getList(1, 50, { filter });
      const brackets = result.items.map((item) => ({
        minIncome: item.lower_bound,
        maxIncome: item.upper_bound,
        taxRate: item.tax_rate,
      }));

      setBracketsFed(brackets);
    };

    fetchFedTaxBrackets();
  }, [filingStatus]);

  // Fetch the tax brackets from the database based on the filing status
  useEffect(() => {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const year = 2023;

    const fetchStateTaxBrackets = async (state: string) => {
      let filter = `jurisdiction = "${state}" && filing_status="${filingStatus}" && year=${year}`;
      let result = await pb.collection('brackets').getList(1, 50, { filter });
      if (result.items.length === 0) {
        filter = `jurisdiction = "${state}" && filing_status="${filingStatus}" && year=${
          year - 1
        }`;
        result = await pb.collection('brackets').getList(1, 50, { filter });
      }
      const brackets = result.items.map((item) => ({
        minIncome: item.lower_bound,
        maxIncome: item.upper_bound,
        taxRate: item.tax_rate,
      }));

      setBracketsStates((prevState) => ({
        ...prevState,
        [state]: brackets,
      }));
    };

    // Fetch state tax brackets when the filingStatus is changed
    Object.keys(bracketsStates).forEach((state) => {
      fetchStateTaxBrackets(state);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filingStatus]);

  // Fetch the tax brackets from the database based on the revenues array
  useEffect(() => {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const year = 2023;

    const fetchStateTaxBrackets = async (state: string) => {
      let filter = `jurisdiction = "${state}" && filing_status="${filingStatus}" && year=${year}`;
      let result = await pb.collection('brackets').getList(1, 50, { filter });
      if (result.items.length === 0) {
        filter = `jurisdiction = "${state}" && filing_status="${filingStatus}" && year=${
          year - 1
        }`;
        result = await pb.collection('brackets').getList(1, 50, { filter });
      }
      const brackets = result.items.map((item) => ({
        minIncome: item.lower_bound,
        maxIncome: item.upper_bound,
        taxRate: item.tax_rate,
      }));

      setBracketsStates((prevState) => ({
        ...prevState,
        [state]: brackets,
      }));
    };

    // Fetch state tax brackets for each new state in the revenues array
    revenues.forEach((revenue) => {
      const { state } = revenue;
      if (undefined === bracketsStates[state]) {
        fetchStateTaxBrackets(state);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revenues]);

  const taxData = useMemo(() => {
    const calculate_tax = (income: number, brackets: TaxBracket[]): number => {
      let remainingIncome = income;
      let taxObligation = 0;

      for (const bracket of brackets) {
        const { minIncome, maxIncome, taxRate } = bracket;

        if (remainingIncome <= 0) {
          break;
        }

        const taxableIncome = Math.min(remainingIncome, maxIncome - minIncome);
        const taxAmount = taxableIncome * taxRate;
        taxObligation += taxAmount;
        remainingIncome -= taxableIncome;
      }

      return taxObligation;
    };

    // Perform tax calculations
    let annualIncome = 0;
    let selfEmploymentIncome = 0;

    for (const revenue of revenues) {
      if (revenue.frequency === 'Yearly' || revenue.frequency === 'One Time') {
        annualIncome += revenue.income;
      } else {
        annualIncome += revenue.income * 12;
      }

      if (revenue.type === '1099') {
        selfEmploymentIncome += revenue.income;
      }
    }

    const adjustedGrossIncome = Math.max(annualIncome - deductions, 0);
    selfEmploymentIncome = Math.min(adjustedGrossIncome, selfEmploymentIncome);
    const ficaTax = 0.062 * adjustedGrossIncome;
    const medicareTax = 0.0145 * adjustedGrossIncome;
    const selfEmploymentTax = 0.062 * selfEmploymentIncome;
    const federalTax = calculate_tax(adjustedGrossIncome, bracketsFed);

    let stateTax = 0;
    for (const revenue of revenues) {
      const stateBrackets = bracketsStates[revenue.state];
      if (stateBrackets !== undefined) {
        stateTax += calculate_tax(revenue.income, stateBrackets);
      }
    }

    const netIncome =
      annualIncome -
      ficaTax -
      medicareTax -
      selfEmploymentTax -
      federalTax -
      stateTax;

    // Return the calculated tax data
    return {
      annualIncome,
      adjustedGrossIncome,
      ficaTax,
      medicareTax,
      selfEmploymentTax,
      federalTax,
      stateTax,
      netIncome,
    };
  }, [revenues, deductions, bracketsFed, bracketsStates]);

  const setStandardDeduction = (status: string) => {
    switch (status) {
      case 'single':
      case 'separate':
        if (deductions === 27700 || deductions === 20800) {
          setDeductions(13850);
        }
        break;
      case 'joint':
      case 'widow':
        if (deductions === 13850 || deductions === 20800) {
          setDeductions(27700);
        }
        break;
      case 'head':
        if (deductions === 13850 || deductions === 27700) {
          setDeductions(20800);
        }
        break;
      default:
        break;
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

  const renderTaxData = (label: string, value: number) => (
    <p className='mb-1'>
      {label}:{' '}
      <span className='font-bold text-green-900 dark:text-white'>
        {formatCurrency(value)}
      </span>
    </p>
  );

  return (
    <div className='flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-xs'>
        <h1 className='text-2xl font-bold mb-1'>Tax Estimator</h1>
        <div>
          {frequencyDisplay === 'Yearly' ? (
            <>
              {renderTaxData('Gross Income', taxData.annualIncome)}
              {renderTaxData(
                'Adjusted Gross Income',
                taxData.adjustedGrossIncome
              )}
              {renderTaxData('FICA Tax', taxData.ficaTax)}
              {renderTaxData('Medicare Tax', taxData.medicareTax)}
              {renderTaxData('Self-Employment Tax', taxData.selfEmploymentTax)}
              {renderTaxData('Federal Tax', taxData.federalTax)}
              {renderTaxData('State Tax', taxData.stateTax)}
              {renderTaxData('Net Income', taxData.netIncome)}
            </>
          ) : (
            <>
              {renderTaxData('Gross Income', taxData.annualIncome / 12)}
              {renderTaxData(
                'Adjusted Gross Income',
                taxData.adjustedGrossIncome / 12
              )}
              {renderTaxData('FICA Tax', taxData.ficaTax / 12)}
              {renderTaxData('Medicare Tax', taxData.medicareTax / 12)}
              {renderTaxData(
                'Self-Employment Tax',
                taxData.selfEmploymentTax / 12
              )}
              {renderTaxData('Federal Tax', taxData.federalTax / 12)}
              {renderTaxData('State Tax', taxData.stateTax / 12)}
              {renderTaxData('Net Income', taxData.netIncome / 12)}
            </>
          )}
        </div>

        <button
          className='px-4 py-2 bg-green-600 text-white rounded hover:bg-gray-600'
          onClick={() => {
            switch (frequencyDisplay) {
              case 'Monthly':
                setFequencyDisplay('Yearly');
                break;
              case 'Yearly':
                setFequencyDisplay('Monthly');
                break;
            }
          }}
        >
          {frequencyDisplay}
        </button>

        <div className='mb-2'>
          <label
            htmlFor='status'
            className='block mb-2 text-green-900 dark:text-white'
          >
            Filing Status
          </label>
          <select
            id='status'
            value={filingStatus}
            onChange={(e) => {
              setFilingStatus(e.target.value);
              setStandardDeduction(e.target.value);
            }}
            className='block w-full p-2 border border-gray-300 rounded'
          >
            <option value='single'>Single</option>
            <option value='joint'>Married, filing jointly</option>
            <option value='separate'>Married, filing separately</option>
            <option value='head'>Head of household</option>
            <option value='widow'>Widow(er)</option>
          </select>
        </div>
        <div className='mb-2'>
          <label
            htmlFor='deductions'
            className='block mb-2 text-black dark:text-white'
          >
            Deductions
          </label>
          <input
            type='number'
            id='deductions'
            placeholder='Deductions'
            value={deductions}
            onChange={(e) => setDeductions(parseFloat(e.target.value))}
            className='block w-full p-2 border border-gray-300 rounded'
          />
        </div>

        {revenues.map((revenue, index) => (
          <RevenueForm
            key={index}
            type={revenue.type}
            setType={(newType) => {
              const updatedRevenues = [...revenues];
              updatedRevenues[index].type = newType;
              setRevenues(updatedRevenues);
            }}
            frequency={revenue.frequency}
            setFrequency={(newFrequency) => {
              const updatedRevenues = [...revenues];
              updatedRevenues[index].frequency = newFrequency;
              setRevenues(updatedRevenues);
            }}
            state={revenue.state}
            setState={(newState) => {
              const updatedRevenues = [...revenues];
              updatedRevenues[index].state = newState;
              setRevenues(updatedRevenues);
            }}
            income={revenue.income}
            setIncome={(newIncome) => {
              const updatedRevenues = [...revenues];
              updatedRevenues[index].income = newIncome;
              setRevenues(updatedRevenues);
            }}
            onRemove={() => {
              const updatedRevenues = [...revenues];
              updatedRevenues.splice(index, 1);
              setRevenues(updatedRevenues);
            }}
          />
        ))}

        <button
          className='px-4 py-2 bg-green-600 text-white rounded hover:bg-gray-600'
          onClick={() => {
            const newRevenue: Revenue = {
              type: 'W2',
              frequency: frequencyDisplay,
              state: 'CA',
              income: 0,
            };
            setRevenues([...revenues, newRevenue]);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
