import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import Footer from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className='bg-[#FFFFFF] min-h-screen flex flex-col'>
      <AppHeader />
      <main
        className='flex-grow w-full sm:my-10'
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
