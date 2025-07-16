import { arrowRightIcon, dentalImageRight } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const VerifiactionPending: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useParams();

  return (
    <div className='w-full max-w-[680px]  flex flex-col items-center justify-center mx-auto mb-8'>
      <div className='space-y-6 mb-2'>
        <div className='mt-8'>
          <Image
            src={dentalImageRight}
            alt='Dental_img'
            className='w-full max-w-md mx-auto'
          />
        </div>
        <div className='w-full mb-6 text-center'>
          <H2
            data-testid='verification-title'
            className='text-xl sm:text-2xl md:text-[28px] font-medium text-[#005399] mb-6 text-center'
          >
            {t('lumifi', `accountPending.${account === 'PA' ? 'paTitle' : account === 'UA' ? 'uaTitle' : 'title'}`)}
          </H2>
          <H4
            data-testid='login-subtitle'
            className='text-[#4E5053] text-sm sm:text-lg leading-[22px] font-medium mb-6'
          >
            {t('lumifi', 'accountPending.message')}
          </H4>
        </div>
      </div>
      <div className='flex gap-4'>
        <button
          data-testid='login-button'
          className='bg-[#009BDF]  flex justify-center items-center gap-3 text-white px-8 h-11 rounded-[4px] text-[18px]  hover:bg-[#4B9BDE] transition-colors shadow-lg cursor-pointer'
          onClick={() => navigate('/login')}
        >
          {t('lumifi', 'common.login')}
          <Image
            src={arrowRightIcon}
            alt='arrowRight icon'
            className='w-[8px] h-[12px]'
          />
        </button>
        <button
          data-testid='contact-support-button'
          className='bg-[#009BDF]  flex justify-center items-center gap-3 text-white px-8 h-11 rounded-[4px] text-[18px]  hover:bg-[#4B9BDE] transition-colors shadow-lg cursor-pointer'
          onClick={() => window.open('https://lumifidental.com/contact/', '_blank', 'noopener,noreferrer')}
        >
          {t('lumifi', 'common.contactSupport')}
          <Image
            src={arrowRightIcon}
            alt='arrowRight icon'
            className='w-[8px] h-[12px]'
          />
        </button>
      </div>
    </div>
  );
};
