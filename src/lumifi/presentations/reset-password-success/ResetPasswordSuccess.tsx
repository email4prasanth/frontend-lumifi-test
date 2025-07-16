import { arrowRightIcon, blueTickIcon, dentalImage } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { t } from '@/lib/utils';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ResetPasswordSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { context } = location.state || '';

  return (
    <div className='w-full max-w-lg  flex flex-col items-center justify-center mx-auto mb-8'>
      <div className='space-y-6 mt-8'>
        <div className='mt-8'>
          <Image
            src={dentalImage}
            alt='Dental_img'
            className='w-[325px] max-w-md mx-auto'
          />
        </div>
        <div className='w-full mb-6 text-center'>
          <div className='inline-flex justify-center items-center gap-2'>
            <Image
              src={blueTickIcon}
              alt='arrowRight icon'
              className='w-[30px] h-[30px]'
            />
            <span
              data-testid='reset-success-message'
              className='text-xl sm:text-2xl md:text-3xl font-normal text-[#005399] text-center'
            >
              {context === 'SP'
                ? t('lumifi', 'setPassword.successMessage')
                : t('lumifi', 'resetPassword.successMessage')}
            </span>
          </div>
        </div>
      </div>
      <button
        data-testid='proceed-to-login-button'
        className='bg-[#009BDF] mt-6 flex justify-center items-center gap-3 text-white px-8 h-11 rounded-[4px] text-[18px]  hover:bg-[#4B9BDE] transition-colors shadow-lg cursor-pointer'
        onClick={() => navigate('/login')}
      >
        {t('lumifi', 'common.proceedToLogin')}
        <Image
          src={arrowRightIcon}
          alt='arrowRight icon'
          className='w-[8px] h-[12px]'
        />
      </button>
    </div>
  );
};
