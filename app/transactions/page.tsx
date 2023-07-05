import PocketBase from 'pocketbase';
import Link from 'next/link';

export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto'

async function getTransactions() {
  const pb = new PocketBase('http://127.0.0.1:8090');

  const data = await pb.collection('transactions').getList();
  return data?.items as any[];
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();
  console.log(transactions)

  return (
    <div>
      <h1>Transactions</h1>
      <div>
        {transactions?.map((transaction) => {
          return <Note key={transaction.id} name={transaction.name} category={transaction.category} date={transaction.date} />;
        })}
      </div>
    </div>
  )
}

function Note({ note }: any) {
  const { id, name, description, date } = note || {};

  return (
    <Link href={`/notes/${id}`}>
      <div>
        <h2>{name}</h2>
        <h5>{description}</h5>
        <h5>{date}</h5>
      </div>
    </Link>
  )
}