import React from 'react';

interface Obligation {
  name: string;
  category: string;
  value: number;
}

interface ObligationProps {
  obligation: Obligation;
  onUpdate: (updatedObligation: Obligation) => void;
  onRemove: () => void;
}

export const ObligationForm: React.FC<ObligationProps> = ({
  obligation,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className='bg-red-300 p-4 flex items-center space-x-4'>
      <div className='flex-grow'>
        <label htmlFor='name' className='text-gray-800 font-medium'>
          Name:
        </label>
        <input
          id='name'
          type='text'
          value={obligation.name}
          onChange={(e) => onUpdate({ ...obligation, name: e.target.value })}
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
          value={obligation.category}
          onChange={(e) =>
            onUpdate({ ...obligation, category: e.target.value })
          }
          className='border border-gray-300 rounded p-2'
        />
      </div>
      <div>
        <label htmlFor='value' className='text-gray-800 font-medium'>
          Value:
        </label>
        <input
          type='number'
          value={obligation.value}
          onChange={(e) =>
            onUpdate({
              ...obligation,
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
