import React from 'react';

interface Income {
  name: string;
  category: string;
  value: number;
}

interface IncomeProps {
  income: Income;
  onUpdate: (updatedIncome: Income) => void;
  onRemove: () => void;
}

export const IncomeForm: React.FC<IncomeProps> = ({
  income,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className='bg-green-300 p-4 flex items-center space-x-4'>
      <div className='flex-grow'>
        <label htmlFor='name' className='text-gray-800 font-medium'>
          Name:
        </label>
        <input
          id='name'
          type='text'
          value={income.name}
          onChange={(e) => onUpdate({ ...income, name: e.target.value })}
          className='border border-gray-300 rounded p-2'
        />
      </div>
      <div>
        <label htmlFor='category' className='text-gray-800 font-medium'>
          Category:
        </label>
        <input
          id='category'
          type='text'
          value={income.category}
          onChange={(e) => onUpdate({ ...income, category: e.target.value })}
          className='border border-gray-300 rounded p-2'
        />
      </div>
      <div>
        <label htmlFor='value' className='text-gray-800 font-medium'>
          Value:
        </label>
        <input
          type='number'
          value={income.value}
          onChange={(e) =>
            onUpdate({
              ...income,
              value: parseFloat(e.target.value),
            })
          }
          className='border border-gray-300 rounded p-2'
        />
      </div>
      <button
        onClick={onRemove}
        className='bg-red-500 text-white rounded px-4 py-2'
      >
        Remove
      </button>
    </div>
  );
};
