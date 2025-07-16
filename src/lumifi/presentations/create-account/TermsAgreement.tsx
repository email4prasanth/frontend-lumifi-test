import { arrowRightIcon, closeIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import type { TermsAndConditions } from '@/lumifi/types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TermsAgreementProps {
  onFinish: () => Promise<void>;
  termsAndConditions: TermsAndConditions;
  onAgreementChange: (agreed: boolean) => void;
}

export const TermsAgreement = React.memo(({ onFinish, termsAndConditions, onAgreementChange }: TermsAgreementProps) => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(termsAndConditions.agreed);

  const handleAgree = () => {
    const newAgreedState = !isAgreed;
    setIsAgreed(newAgreedState);
    onAgreementChange(newAgreedState);
  };

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
        <H2
          data-testid='terms-title'
          className='text-xl sm:text-2xl text-[#255294] font-medium mb-2'
        >
          {t('lumifi', 'termsInfo.title')}
        </H2>
        <H4
          data-testid='terms-subtitle'
          className='text-[#4B4B4B] text-sm sm:text-lg leading-[21px] font-medium italic mb-6'
        >
          {t('lumifi', 'termsInfo.subtitle')}
        </H4>
      </div>
      <div className='w-4/5 md:w-[65%] h-60 mx-auto flex items-center justify-center'>
        <div className='flex justify-between items-start gap-4'>
          <input
            data-testid='terms-checkbox'
            type='checkbox'
            id='agreeTerms'
            checked={isAgreed}
            onChange={handleAgree}
            className='w-12 h-12 cursor-pointer accent-[#009BDF] rounded'
          />
          <label
            data-testid='terms-label'
            htmlFor='agreeTerms'
            className='block pt-1.5 text-lg leading-7 font-medium text-[#4E5053]'
          >
            By creating this account, I agree to Lumifi's standard{' '}
            <a
              data-testid='terms-link'
              href='http://lumifidental.com/terms-of-service/'
              target='_blank'
              className='cursor-pointer hover:underline font-medium text-[#009BDF]'
            >
              terms of use
            </a>{' '}
            and{' '}
            <a
              data-testid='policy-link'
              href='http://lumifidental.com/terms-of-service/'
              target='_blank'
              className='cursor-pointer hover:underline font-medium text-[#009BDF]'
            >
              privacy policy
            </a>
            .
          </label>
        </div>
      </div>
      <div className='flex justify-center items-center gap-5 w-full py-4'>
        <button
          data-testid='cancel-button'
          onClick={() => navigate('/login')}
          type='button'
          className='flex justify-center items-center gap-1 text-lg font-medium text-[#009BDF] w-28 h-10 focus:outline-none hover:underline cursor:pointer disabled:cursor-not-allowed'
        >
          <Image
            src={closeIcon}
            alt='close-icon'
            className='w-5 h-3'
          />
          <span>{t('lumifi', 'common.cancel')}</span>
        </button>
        <button
          data-testid='finish-button'
          onClick={() => {
            if (isAgreed) {
              onFinish();
            }
          }}
          disabled={!isAgreed}
          className='flex justify-center items-center gap-3 text-lg font-medium bg-[#009BDF] text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] cursor-pointer disabled:cursor-not-allowed'
        >
          <span>{t('lumifi', 'common.finish')}</span>
          <Image
            src={arrowRightIcon}
            alt='arrow-right'
            className='w-2 h-3'
          />
        </button>
      </div>
    </div>
  );
});
