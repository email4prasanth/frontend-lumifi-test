import { dentalImage, plusIcon, searchWhiteIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H1, H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/patients');
  };

  return (
    <div className='container mx-auto px-4 sm:px-8'>
      <div className='flex flex-col items-center justify-center pb-8'>
        <H1 className='text-2xl sm:text-3xl font-semibold text-[#005399] text-center my-10'>
          {t('lumifi', 'homePage.title')}
        </H1>
        <div className='grid sm:grid-cols-2 gap-16 sm:gap-5 max-w-4xl'>
          <div className='sm:p-6 flex flex-col items-center justify-between text-center'>
            <H2 className='text-2xl font-medium text-[#4E5053] mb-4'> {t('lumifi', 'homePage.addImplant')}</H2>
            <H4 className='text-lg font-normal px-3 text-[#4E5053] mb-6'>
              {t('lumifi', 'homePage.addImplantDescription')}
            </H4>
            <button
              onClick={handleNavigate}
              className='w-52 h-11 flex justify-center items-center gap-2 bg-[#009BDF] text-lg font-medium text-white rounded-[4px] focus:outline-none'
            >
              <Image
                src={plusIcon}
                alt='plus-icon'
                className='w-4 h-4'
              />
              <span> {t('lumifi', 'homePage.addImplantBtn')}</span>
            </button>
          </div>

          <div className='sm:p-6 flex flex-col items-center justify-between text-center'>
            <H2 className='text-2xl font-medium text-[#4E5053] mb-4'>{t('lumifi', 'homePage.findImplant')}</H2>
            <H4 className='text-lg font-normal px-3 text-[#4E5053] mb-6'>
              {t('lumifi', 'homePage.findImplantDescription')}{' '}
            </H4>
            <button
              onClick={handleNavigate}
              className='w-64 h-11 flex justify-center items-center gap-2 bg-[#009BDF] text-lg font-medium text-white rounded-[4px] focus:outline-none'
            >
              <Image
                src={searchWhiteIcon}
                alt='search-icon'
                className='h-4 w-4'
              />
              <span> {t('lumifi', 'homePage.findImplantBtn')}</span>
            </button>
          </div>
        </div>

        <div className='mt-8'>
          <Image
            src={dentalImage}
            alt='Dental_img'
            className='w-full max-w-md mx-auto'
          />
        </div>
      </div>
    </div>
  );
};
