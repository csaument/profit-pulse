import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Profit Pulse</title>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/transactions">Transactions</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
