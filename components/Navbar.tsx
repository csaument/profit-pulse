'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import LogoSVG from '../app/logo.svg';

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className='flex items-center justify-between flex-wrap bg-gray-300 dark:bg-gray-900 z-20 top-0 border-b border-gray-600'>
        <div className='flex items-center flex-shrink-0 text-green-900 dark:text-white mr-6'>
          <Link href='/' className='flex items-center'>
            <Image
              src={LogoSVG}
              alt='profitpulse'
              className='fill-current h-8 w-8 mr-2 text-green-900'
              width='54'
              height='54'
            />
            <span className='font-semibold text-2xl tracking-tight text-green-900'>
              Profit Pulse
            </span>
          </Link>
        </div>
        <div className='block lg:hidden'>
          <button
            className='flex items-center px-3 py-2 border rounded text-green-900 border-green-900 hover:text-gray-600 hover:border-gray-600'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className='fill-current h-3 w-3'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <title>Menu</title>
              <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
            </svg>
          </button>
        </div>
        <div
          className={`${
            menuOpen ? 'block' : 'hidden'
          } w-full lg:flex lg:items-center lg:w-auto`}
        >
          <div className='text-sm lg:flex-grow'>
            <Link
              href='/taxman'
              className='block mt-2 lg:inline-block lg:mt-0 text-green-900 hover:text-gray-600 mr-4 text-xl'
            >
              Tax Estimator
            </Link>
            <Link
              href='/budget-buddy'
              className='block mt-2 lg:inline-block lg:mt-0 text-green-900 hover:text-gray-600 mr-4 text-xl'
            >
              Budget Builder
            </Link>
            <Link
              href='/transactions'
              className='block mt-2 lg:inline-block lg:mt-0 text-green-900 hover:text-gray-600 mr-4 text-xl'
            >
              Transactions
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
