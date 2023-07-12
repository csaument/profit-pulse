import React from 'react';

interface Asset {
  name: string;
  value: number;
}

interface AssetProps {
  asset: Asset;
  onUpdate: (updatedAsset: Asset) => void;
  onRemove: () => void;
}

export const AssetForm: React.FC<AssetProps> = ({
  asset,
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
          value={asset.name}
          onChange={(e) => onUpdate({ ...asset, name: e.target.value })}
          className='border border-gray-300 rounded p-2'
        />
      </div>
      <div>
        <label htmlFor='value' className='text-gray-800 font-medium'>
          Value:
        </label>
        <input
          type='number'
          value={asset.value}
          onChange={(e) =>
            onUpdate({
              ...asset,
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
