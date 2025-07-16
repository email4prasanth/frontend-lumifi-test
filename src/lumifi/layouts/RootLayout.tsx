import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export const RootLayout: React.FC = () => {
  return (
    <div className='bg-[#FFFFFF] min-h-screen flex flex-col'>
      <Header />
      <main
        className='flex-grow w-full'
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(216, 237, 249, 0.5) 0%, #FFFFFF 100%)',
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
