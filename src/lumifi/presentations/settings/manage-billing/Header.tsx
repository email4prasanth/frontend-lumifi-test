import { cardIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H3 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import type React from 'react';

export const Header: React.FC = () => {
  return (
    <div className='flex justify-between items-center mb-4 border-b-[3px] border-[#D6DBDE] py-4'>
      <H3 className='text-xl sm:text-2xl font-semibold text-[#4E5053]'>{t('lumifi', 'manageBilling.heading')}</H3>
      <div className='flex justify-between items-center'>
        <Image
          src={cardIcon}
          alt='user-icon'
          className='w-[20px] h-[14px]'
        />
      </div>
    </div>
  );
};
