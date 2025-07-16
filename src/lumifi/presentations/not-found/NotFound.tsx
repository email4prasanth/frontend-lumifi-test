import { brokenTooth } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H1, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <div
        className='w-full max-w-xl px-6 py-12 rounded-lg  text-center'
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(216, 237, 249, 0.5) 0%, #FFFFFF 100%)',
        }}
      >
        <div className='mb-6 flex justify-center'>
          <Image
            data-testid='notfound-image'
            src={brokenTooth}
            alt='Broken Tooth Icon'
            className='w-32 h-32 object-contain'
          />
        </div>

        <H1
          data-testid='notfound-title'
          className='text-[96px] font-extrabold text-[#009BDF] tracking-tight leading-none mb-4'
        >
          {t('lumifi', 'notFound.title')}
        </H1>

        <H4
          data-testid='notfound-description'
          className='text-gray-600 text-lg mb-8'
        >
          {t('lumifi', 'notFound.description')}
        </H4>

        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <button
            data-testid='notfound-go-back'
            onClick={() => navigate(-1)}
            className='px-6 py-2 tex-sm bg-white border border-gray-300  rounded-md shadow-md hover:bg-gray-50 text-gray-700 cursor-pointer'
          >
            {t('lumifi', 'notFound.goBack')}
          </button>
          <button
            data-testid='notfound-home-page'
            onClick={() => navigate('/home')}
            className='px-6 py-2 bg-[#4B9CDC] hover:bg-[#68ADDC] text-white rounded-md shadow-md transition cursor-pointer'
          >
            {t('lumifi', 'notFound.homePage')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
