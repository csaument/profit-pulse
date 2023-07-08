import PocketBase from 'pocketbase';

export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto';

async function getTransactions() {
  const pb = new PocketBase('http://127.0.0.1:8090');
  const data = await pb.collection('transactions').getList();
  return data?.items as any[];
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div>
      <h1>Transactions</h1>
      <div>
        {transactions?.map((transaction) => {
          return (
            <>
              <p>{transaction.id}</p>
              <p>{transaction.name}</p>
              <p>{transaction.category}</p>
              <p>{transaction.date}</p>
            </>
          );
        })}
      </div>
    </div>
  );
}
