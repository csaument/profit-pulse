import React from 'react';

interface Liability {
  name: string;
  value: number;
}

interface LiabilityProps {
  liability: Liability;
  onUpdate: (updatedLiability: Liability) => void;
  onRemove: () => void;
}

export const LiabilityForm: React.FC<LiabilityProps> = ({
  liability,
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
          value={liability.name}
          onChange={(e) => onUpdate({ ...liability, name: e.target.value })}
          className='border border-gray-300 rounded p-2'
        />
      </div>
      <div>
        <label htmlFor='value' className='text-gray-800 font-medium'>
          Value:
        </label>
        <input
          type='number'
          value={liability.value}
          onChange={(e) =>
            onUpdate({
              ...liability,
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
