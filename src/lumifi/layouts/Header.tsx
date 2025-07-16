import { lumifiLogo } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header data-testid='header'>
      <div
        style={{
          background: 'linear-gradient(0deg, #FFFFFF 0%, #E6F5FD 100%)',
        }}
        className='h-[90px] w-full flex items-center justify-center'
      >
        <div
          className='w-36 h-14 cursor-pointer'
          onClick={() => navigate('/')}
          data-testid='header-logo-wrapper'
        >
          <Image
            src={lumifiLogo}
            alt='Lumifi Logo'
            className='w-full h-full'
            data-testid='header-logo'
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
