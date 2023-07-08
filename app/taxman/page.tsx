'use client';

import { useState, useMemo, useEffect } from 'react';
import PocketBase from 'pocketbase';

interface TaxBracket {
  minIncome: number;
  maxIncome: number;
  taxRate: number;
}

export default function TaxPage() {
  const [type, setType] = useState('W2');
  const [frequency, setFrequency] = useState('Monthly');
  const [frequencyDisplay, setFequencyDisplay] = useState('Monthly');
  const [state, setState] = useState('CA');
  const [income, setIncome] = useState(0);
  const [deductions, setDeductions] = useState(13850);
  const [filingStatus, setFilingStatus] = useState('S');

  // Define the tax brackets for federal and state
  const [bracketsFed, setBracketsFed] = useState<TaxBracket[]>([]);
  const [bracketsState, setBracketsState] = useState<TaxBracket[]>([]);

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
    // Create an instance of PocketBase
    const pb = new PocketBase('http://127.0.0.1:8090');
    const year = 2023;

    const fetchStateTaxBrackets = async () => {
      let filter = `jurisdiction = "${state}" && filing_status="${filingStatus}" && year=${year}`;
      let result = await pb.collection('brackets').getList(1, 50, { filter });
      if (0 === result.items.length) {
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

      setBracketsState(brackets);
    };

    fetchStateTaxBrackets();
  }, [filingStatus, state]);

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
    const annualIncome = 'Monthly' === frequency ? income * 12 : income;
    const adjustedGrossIncome = Math.max(annualIncome - deductions, 0);
    const ficaTax = 0.062 * adjustedGrossIncome;
    const medicareTax = 0.0145 * adjustedGrossIncome;
    const selfEmploymentTax = '1099' == type ? 0.062 * adjustedGrossIncome : 0;
    const federalTax = calculate_tax(adjustedGrossIncome, bracketsFed);
    const stateTax = calculate_tax(adjustedGrossIncome, bracketsState);
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
  }, [income, deductions, type, bracketsFed, bracketsState, frequency]);

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

  return (
    <div className='flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-xs'>
        <h1 className='text-2xl font-bold mb-1'>Tax Estimator</h1>
        <div>
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

          {frequencyDisplay === 'Yearly' ? (
            <>
              <p className='mb-1'>
                Gross Income:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.annualIncome.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Adjusted Gross Income:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.adjustedGrossIncome.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                FICA Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.ficaTax.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Medicare Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.medicareTax.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Self-Employment Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.selfEmploymentTax.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Federal Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.federalTax.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                State Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.stateTax.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1 font-semibold'>
                Net Income:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {taxData.netIncome.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
            </>
          ) : (
            <>
              <p className='mb-1'>
                Gross Income:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.annualIncome / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Adjusted Gross Income:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.adjustedGrossIncome / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                FICA Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.ficaTax / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Medicare Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.medicareTax / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Self-Employment Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.selfEmploymentTax / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                Federal Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.federalTax / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1'>
                State Tax:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.stateTax / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
              <p className='mb-1 font-semibold'>
                Net Income:{' '}
                <span className='font-bold text-green-900 dark:text-white'>
                  {(taxData.netIncome / 12).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p>
            </>
          )}
        </div>

        <form className='bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <div className='mb-2'>
            <label
              htmlFor='type'
              className='block mb-2 text-green-900 dark:text-white'
            >
              Income Type
            </label>
            <select
              id='type'
              value={type}
              onChange={(e) => setType(e.target.value)}
              className='block w-full p-2 border border-gray-300 rounded'
            >
              <option value='W2'>W2</option>
              <option value='1099'>1099</option>
            </select>
          </div>
          <div className='mb-2'>
            <label
              htmlFor='frequency'
              className='block mb-2 text-green-900 dark:text-white'
            >
              Frequency
            </label>
            <select
              id='frequency'
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className='block w-full p-2 border border-gray-300 rounded'
            >
              <option value='Yearly'>Yearly</option>
              <option value='Monthly'>Monthly</option>
              <option value='Single'>One time</option>
            </select>
          </div>
          <div className='mb-2'>
            <label
              htmlFor='state'
              className='block mb-2 text-green-900 dark:text-white'
            >
              State
            </label>
            <select
              id='state'
              value={state}
              onChange={(e) => setState(e.target.value)}
              className='block w-full p-2 border border-gray-300 rounded'
            >
              <option value='CA'>California</option>
            </select>
          </div>
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
              htmlFor='income'
              className='block mb-2 text-green-900 dark:text-white'
            >
              Income
            </label>
            <input
              type='number'
              id='income'
              placeholder='Enter your income'
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value))}
              className='block w-full p-2 border border-gray-300 rounded'
            />
          </div>
          <div className='mb-2'>
            <label
              htmlFor='deductions'
              className='block mb-2 text-green-900 dark:text-white'
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
          <div className='flex justify-between'>
            <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
              Add
            </button>
            <button className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
              Calculate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
