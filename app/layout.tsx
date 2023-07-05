import { NavBar } from '../components/Navbar';
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Profit Pulse</title>
        <link rel='icon' href='/logo.svg' sizes='any' />
      </head>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
