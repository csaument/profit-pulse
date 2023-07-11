'use client';
import { useState, useMemo } from 'react';
import { AssetForm } from '../../components/Asset';
import { LiabilityForm } from '../../components/Liability';
import { IncomeForm } from '../../components/Income';
import { ObligationForm } from '../../components/Obligation';

interface Asset {
  name: string;
  value: number;
}

interface Liability {
  name: string;
  value: number;
}

interface Income {
  name: string;
  category: string;
  value: number;
}

interface Obligation {
  name: string;
  category: string;
  value: number;
}

export default function BudgetPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);

  const netWorth = useMemo(() => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + liability.value,
      0
    );
    return totalAssets - totalLiabilities;
  }, [assets, liabilities]);

  const cashFlow = useMemo(() => {
    const totalIncome = incomes.reduce((sum, income) => sum + income.value, 0);
    const totalObligations = obligations.reduce(
      (sum, obligation) => sum + obligation.value,
      0
    );
    return totalIncome - totalObligations;
  }, [incomes, obligations]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-4'>Budget Buddy</h1>
      <h2 className='text-lg mb-4'>
        Net Worth:{' '}
        <span className={netWorth >= 0 ? 'text-green-500' : 'text-red-500'}>
          ${Math.abs(netWorth).toLocaleString()}
        </span>
      </h2>
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>Assets</h3>
        {assets.map((asset, index) => (
          <AssetForm
            key={index}
            asset={asset}
            onUpdate={(updatedAsset) =>
              setAssets((prevAssets) =>
                prevAssets.map((prevAsset, i) =>
                  i === index ? updatedAsset : prevAsset
                )
              )
            }
            onRemove={() =>
              setAssets((prevAssets) =>
                prevAssets.filter((_, i) => i !== index)
              )
            }
          />
        ))}
        <button
          className='px-4 py-2 bg-green-500 text-white rounded'
          onClick={() => setAssets([...assets, { name: '', value: 0 }])}
        >
          Add Asset
        </button>
      </div>
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>Liabilities</h3>
        {liabilities.map((liability, index) => (
          <LiabilityForm
            key={index}
            liability={liability}
            onUpdate={(updatedLiability) =>
              setLiabilities((prevLiabilities) =>
                prevLiabilities.map((prevLiability, i) =>
                  i === index ? updatedLiability : prevLiability
                )
              )
            }
            onRemove={() =>
              setLiabilities((prevLiabilities) =>
                prevLiabilities.filter((_, i) => i !== index)
              )
            }
          />
        ))}
        <button
          className='px-4 py-2 bg-red-500 text-white rounded'
          onClick={() =>
            setLiabilities([...liabilities, { name: '', value: 0 }])
          }
        >
          Add Liability
        </button>
      </div>
      <h2 className='text-lg mb-4'>
        Cash Flow:{' '}
        <span className={cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}>
          ${Math.abs(cashFlow).toLocaleString()}
        </span>
      </h2>
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>Incomes</h3>
        {incomes.map((income, index) => (
          <IncomeForm
            key={index}
            income={income}
            onUpdate={(updatedIncome) =>
              setIncomes((prevIncomes) =>
                prevIncomes.map((prevIncome, i) =>
                  i === index ? updatedIncome : prevIncome
                )
              )
            }
            onRemove={() =>
              setIncomes((prevIncomes) =>
                prevIncomes.filter((_, i) => i !== index)
              )
            }
          />
        ))}
        <button
          className='px-4 py-2 bg-green-500 text-white rounded'
          onClick={() =>
            setIncomes([...incomes, { name: '', category: '', value: 0 }])
          }
        >
          Add Income
        </button>
      </div>
      <div className='mb-8'>
        <h3 className='text-xl font-bold mb-4'>Obligations</h3>
        {obligations.map((obligation, index) => (
          <ObligationForm
            key={index}
            obligation={obligation}
            onUpdate={(updatedObligation) =>
              setObligations((prevObligations) =>
                prevObligations.map((prevObligation, i) =>
                  i === index ? updatedObligation : prevObligation
                )
              )
            }
            onRemove={() =>
              setObligations((prevObligations) =>
                prevObligations.filter((_, i) => i !== index)
              )
            }
          />
        ))}
        <button
          className='px-4 py-2 bg-red-500 text-white rounded'
          onClick={() =>
            setObligations([
              ...obligations,
              { name: '', category: '', value: 0 },
            ])
          }
        >
          Add Obligation
        </button>
      </div>
    </div>
  );
}
