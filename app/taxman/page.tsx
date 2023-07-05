'use client';

import { useState } from 'react';

export default function TaxPage() {
  const [type, setType] = useState('W2');
  const [frequency, setFrequency] = useState('Monthly');
  const [state, setState] = useState('CA');
  const [income, setIncome] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [filingStatus, setFilingStatus] = useState('S');

  return (
    <div className='w-full max-w-xs'>
      <h1 className='text-2xl font-bold mb-4'>Tax Estimator</h1>
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
