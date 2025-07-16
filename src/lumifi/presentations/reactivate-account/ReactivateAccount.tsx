import { arrowRightIcon, dentalImageRight } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ReactivateAccount: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full max-w-[680px]  flex flex-col items-center justify-center mx-auto mb-8'>
      <div className='space-y-6 mb-2'>
        <div className='mt-8'>
          <Image
            src={dentalImageRight}
            alt='Dental_img'
            className='w-[350px] max-w-md mx-auto'
          />
        </div>
        <div className='w-full mb-6 text-center'>
          <H2 className='text-xl sm:text-2xl md:text-[28px] font-medium text-[#005399] mb-6 text-center'>
            {t('lumifi', 'reactivateAccount.title')} 05/25/2025.
          </H2>
          <H4
            data-testid='login-subtitle'
            className='text-[#4E5053] text-sm sm:text-lg leading-[22px] font-medium mb-6'
          >
            {t('lumifi', 'reactivateAccount.message')}
          </H4>
        </div>
      </div>
      <button
        data-testid='reactivate-button'
        className='bg-[#009BDF]  flex justify-center items-center gap-3 text-white px-8 h-11 rounded-[4px] text-[18px]  hover:bg-[#4B9BDE] transition-colors shadow-lg cursor-pointer'
        onClick={() => navigate('/account-activated', { replace: true })}
      >
        {t('lumifi', 'common.reactivateAccount')}
        <Image
          src={arrowRightIcon}
          alt='arrowRight icon'
          className='w-[8px] h-[12px]'
        />
      </button>
    </div>
  );
};
