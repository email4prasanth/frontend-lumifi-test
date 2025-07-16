import { dentalImage } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-b  flex items-center justify-center '>
      <div className='max-w-2xl w-full text-center  p-10 relative overflow-hidden'>
        <div className='flex justify-center mb-6'>
          <Image
            src={dentalImage}
            alt='No Access Tooth SVG'
            className='w-full h-full object-contain'
            data-testid='noaccess-img'
          />
        </div>

        <H2
          className='text-[#009BDF] text-4xl font-extrabold mb-4 tracking-tight'
          data-testid='noaccess-title'
        >
          {t('lumifi', 'noAccess.title')}
        </H2>

        <H4
          className='text-gray-700 mb-6 text-lg'
          data-testid='noaccess-description'
        >
          {t('lumifi', 'noAccess.description')}
        </H4>

        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-2 text-sm bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 text-gray-800 transition'
            data-testid='noaccess-back'
          >
            {t('lumifi', 'noAccess.goBack')}
          </button>
          <button
            onClick={() => navigate('/home')}
            className='px-6 py-2 text-sm bg-[#4B9CDC] hover:bg-[#68ADDC] text-white rounded-md shadow transition'
            data-testid='noaccess-home'
          >
            {t('lumifi', 'noAccess.homePage')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
