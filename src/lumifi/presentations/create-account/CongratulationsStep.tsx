import { arrowRightIcon, dentalImage } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface CongratulationsStepProps {
  needsVerification: boolean;
}

export const CongratulationsStep: React.FC<CongratulationsStepProps> = ({ needsVerification }) => {
  const navigate = useNavigate();

  return (
    <div
      className='w-full'
      data-testid='congratulations-step-container'
    >
      <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
        <H2
          data-testid='congratulations-title'
          className='text-xl sm:text-2xl text-[#255294] font-medium mb-2'
        >
          {needsVerification ? t('lumifi', 'createAcc.almostThere') : t('lumifi', 'createAcc.congratulations')}!
        </H2>
        <H4
          data-testid='congratulations-subtitle'
          className='text-[#4B4B4B] text-sm sm:text-lg leading-[21px] font-medium italic mb-6'
        >
          {needsVerification ? t('lumifi', 'createAcc.needsVerification') : t('lumifi', 'createAcc.verified')}
        </H4>
      </div>
      <div className='flex flex-col justify-center items-center gap-5 mt-10 mb-3'>
        <div className='w-80 h-72'>
          <Image
            src={dentalImage}
            alt='Dental Office'
            className='w-full h-full'
          />
        </div>
        <div className='flex justify-center items-center gap-5 w-full pt-6'>
          <button
            data-testid='lets-go-button'
            onClick={() => navigate('/login')}
            type='button'
            className='flex justify-center items-center gap-3 text-lg font-medium bg-[#009BDF] text-white w-28 h-10 rounded-[4px] focus:outline-none'
          >
            <span>{t('lumifi', 'common.letsGo')}</span>
            <Image
              src={arrowRightIcon}
              alt='arrow-right'
              className='w-2 h-3'
            />
          </button>
        </div>
      </div>
    </div>
  );
};
