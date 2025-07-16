import { arrowRightIcon, dentalImage, suggestionIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const stepNumbers: number[] = [1, 2, 3, 4];

  const steps = stepNumbers.map((num) => ({
    number: num,
    text: t('lumifi', `welcome.steps.${num}.text`),
    note: t('lumifi', `welcome.steps.${num}.note`, { defaultValue: '' }),
    optional: t('lumifi', `welcome.steps.${num}.optional`, { defaultValue: '' }),
  }));

  return (
    <div data-testid='welcome-root'>
      <div className='mt-16 mb-8 text-center'>
        <H2
          data-testid='welcome-title'
          className='text-[36px] md:text-4xl font-semibold text-[#005399] mb-6'
        >
          {t('lumifi', 'welcome.title')}
        </H2>
        <H4
          data-testid='welcome-subtitle'
          className='font-medium text-[#4E5053]'
        >
          {t('lumifi', 'welcome.subtitle')}
        </H4>
      </div>
      <div
        className='w-full max-w-lg  flex flex-col items-center justify-center mx-auto mb-8'
        data-testid='welcome-steps-container'
      >
        <div className='space-y-6'>
          {steps.map((step) => (
            <div
              key={step.number}
              className='flex items-start gap-4  mb-4'
              data-testid={`welcome-step-${step.number}`}
            >
              <div
                className='flex items-center justify-center w-8 h-8 rounded-full bg-[#009BDF] text-white font-medium text-sm'
                data-testid={`welcome-step-number-${step.number}`}
              >
                {step.number}
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-2'>
                  <H4
                    data-testid={`welcome-step-text-${step.number}`}
                    className=' text-[#4E5053] font-medium'
                  >
                    {step.text}
                  </H4>
                  {step.optional && (
                    <span
                      data-testid={`welcome-step-optional-${step.number}`}
                      className='text-sm text-gray-500 italic'
                    >
                      (optional)
                    </span>
                  )}
                </div>
                {step.note && (
                  <span
                    data-testid={`welcome-step-note-${step.number}`}
                    className='text-sm text-[#4E5053] flex items-center gap-2 ml-4 italic'
                  >
                    <Image
                      src={suggestionIcon}
                      alt='suggestion icon'
                      className='w-[20px] h-[20px]'
                    />
                    {step.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          data-testid='welcome-get-started-btn'
          className='bg-[#009BDF] mt-4 flex justify-center items-center gap-3 text-white px-8 h-11 rounded-[4px] text-[18px]  hover:bg-[#4B9BDE] transition-colors shadow-lg cursor-pointer'
          onClick={() => navigate('/signup')}
        >
          {t('lumifi', 'welcome.getStarted')}
          <Image
            data-testid='welcome-arrow-icon'
            src={arrowRightIcon}
            alt='arrowRight icon'
            className='w-[8px] h-[12px]'
          />
        </button>
      </div>
      <div className='mt-8'>
        <Image
          src={dentalImage}
          alt='Dental_img'
          className='w-full max-w-md mx-auto'
          data-testid='welcome-dental-image'
        />
      </div>
    </div>
  );
};
