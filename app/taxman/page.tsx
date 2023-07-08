'use client';

import { useState, useMemo } from 'react';

export default function TaxPage() {
  const [type, setType] = useState('W2');
  const [frequency, setFrequency] = useState('Monthly');
  const [state, setState] = useState('CA');
  const [income, setIncome] = useState(0);
  const [deductions, setDeductions] = useState(13850);
  const [otherIncome, setOtherIncome] = useState(0);
  const [filingStatus, setFilingStatus] = useState('S');

  interface TaxBracket {
    minIncome: number;
    maxIncome: number;
    taxRate: number;
  }

  const brackets_fed: TaxBracket[] = [
    {
      minIncome: 0,
      maxIncome: 11000,
      taxRate: 0.1,
    },
    {
      minIncome: 11001,
      maxIncome: 44725,
      taxRate: 0.12,
    },
    {
      minIncome: 44726,
      maxIncome: 95375,
      taxRate: 0.22,
    },
    {
      minIncome: 95376,
      maxIncome: 182100,
      taxRate: 0.24,
    },
    {
      minIncome: 182101,
      maxIncome: 231250,
      taxRate: 0.32,
    },
    {
      minIncome: 231251,
      maxIncome: 578125,
      taxRate: 0.35,
    },
    {
      minIncome: 578126,
      maxIncome: Infinity,
      taxRate: 0.37,
    },
  ];

  const brackets_ca = [
    {
      minIncome: 0,
      maxIncome: 17618,
      taxRate: 0.01,
    },
    {
      minIncome: 17619,
      maxIncome: 41766,
      taxRate: 0.02,
    },
    {
      minIncome: 41767,
      maxIncome: 65920,
      taxRate: 0.04,
    },
    {
      minIncome: 65921,
      maxIncome: 91506,
      taxRate: 0.06,
    },
    {
      minIncome: 91507,
      maxIncome: 115648,
      taxRate: 0.083,
    },
    {
      minIncome: 115649,
      maxIncome: 590746,
      taxRate: 0.103,
    },
    {
      minIncome: 590747,
      maxIncome: 708890,
      taxRate: 0.113,
    },
    {
      minIncome: 708891,
      maxIncome: 1181484,
      taxRate: 0.123,
    },
    {
      minIncome: 1181485,
      maxIncome: 1999999,
      taxRate: 0.133,
    },
  ];

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
    // Perform tax calculations here based on the state values
    const grossIncome = income + otherIncome;
    const adjustedGrossIncome = Math.max(grossIncome - deductions, 0);
    const ficaTax = 0.062 * adjustedGrossIncome;
    const medicareTax = 0.0145 * adjustedGrossIncome;
    const selfEmploymentTax = '1099' == type ? 0.062 * adjustedGrossIncome : 0;
    const federalTax = calculate_tax(adjustedGrossIncome, brackets_fed);
    const stateTax = calculate_tax(adjustedGrossIncome, brackets_ca);
    const netIncome =
      grossIncome -
      ficaTax -
      medicareTax -
      selfEmploymentTax -
      federalTax -
      stateTax;

    // Return the calculated tax data
    return {
      grossIncome,
      adjustedGrossIncome,
      ficaTax,
      medicareTax,
      selfEmploymentTax,
      federalTax,
      stateTax,
      netIncome,
    };
  }, [income, otherIncome, deductions, type, brackets_fed, brackets_ca]);

  return (
    <div className='w-full max-w-xs'>
      <h1 className='text-2xl font-bold mb-4'>Tax Estimator</h1>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Tax Data</h2>
        <p className='mb-2'>
          Gross Income:{' '}
          <span className='font-bold'>
            {taxData.grossIncome.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
        <p className='mb-2'>
          Adjusted Gross Income:{' '}
          <span className='font-bold'>
            {taxData.adjustedGrossIncome.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
        <p className='mb-2'>
          FICA Tax:{' '}
          <span className='font-bold'>
            {taxData.ficaTax.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
        <p className='mb-2'>
          Medicare Tax:{' '}
          <span className='font-bold'>
            {taxData.medicareTax.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
        <p className='mb-2'>
          Self-Employment Tax:{' '}
          <span className='font-bold'>
            {taxData.selfEmploymentTax.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
        <p className='mb-2'>
          Federal Tax:{' '}
          <span className='font-bold'>
            {taxData.federalTax.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
        <p className='mb-2'>
          State Tax:{' '}
          <span className='font-bold'>
            {taxData.stateTax.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
        <p className='mb-2'>
          Net Income:{' '}
          <span className='font-bold'>
            {taxData.netIncome.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </span>
        </p>
      </div>

      <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-4'>
          <label htmlFor='type' className='block mb-2'>
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
        <div className='mb-4'>
          <label htmlFor='frequency' className='block mb-2'>
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
        <div className='mb-4'>
          <label htmlFor='state' className='block mb-2'>
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
        <div className='mb-4'>
          <label htmlFor='status' className='block mb-2'>
            Filing Status
          </label>
          <select
            id='status'
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            className='block w-full p-2 border border-gray-300 rounded'
          >
            <option value='S'>Single</option>
            <option value='MJ'>Married, filing jointly</option>
            <option value='MS'>Married, filing separately</option>
            <option value='H'>Head of household</option>
            <option value='W'>Widow(er)</option>
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='income' className='block mb-2'>
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
        <div className='mb-4'>
          <label htmlFor='deductions' className='block mb-2'>
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
        <div className='mb-4'>
          <label htmlFor='other' className='block mb-2'>
            Other Income
          </label>
          <input
            type='number'
            id='other'
            placeholder='Other income'
            value={otherIncome}
            onChange={(e) => setOtherIncome(parseFloat(e.target.value))}
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
  );
}
