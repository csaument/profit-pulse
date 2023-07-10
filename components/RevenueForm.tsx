'use client';

interface RevenueFormProps {
  type: string;
  setType: (value: string) => void;
  frequency: string;
  setFrequency: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  income: number;
  setIncome: (value: number) => void;
  onRemove: () => void;
}

export const RevenueForm: React.FC<RevenueFormProps> = ({
  type,
  setType,
  frequency,
  setFrequency,
  state,
  setState,
  income,
  setIncome,
  onRemove,
}) => {
  return (
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
      <button
        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-600'
        onClick={onRemove}
      >
        Remove
      </button>
    </form>
  );
};
