import { addDoctorsIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H3 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  mode: 'list' | 'add' | 'edit';
}

export const Header: React.FC<HeaderProps> = ({ mode }) => {
  const navigate = useNavigate();
  const getTitle = () => {
    const mapTitle = {
      add: t('lumifi', 'manageDoctor.header.addDoctor'),
      edit: t('lumifi', 'manageDoctor.header.editDoctor'),
      list: t('lumifi', 'manageDoctor.header.listDoctor'),
    };
    return mapTitle[mode] || t('lumifi', 'manageDoctor.header.listDoctor');
  };

  const isButtonDisabled = mode !== 'list';

  return (
    <div className='flex justify-between items-center mb-4 border-b-[3px] border-[#D6DBDE] py-4'>
      <H3 className='text-xl sm:text-2xl font-semibold text-[#4E5053]'>{getTitle()}</H3>
      <div className='flex justify-between items-center'>
        {mode === 'list' && (
          <button
            onClick={() => navigate('/settings/doctor/add')}
            disabled={isButtonDisabled}
            className={`flex justify-center items-center gap-2 px-3 h-9 font-medium text-base border rounded-[3px] cursor-pointer whitespace-nowrap
            ${
              isButtonDisabled
                ? 'border-gray-[text-[#009BDF] text-[#009BDF] cursor-not-allowed bg-gray-50'
                : 'text-[#009BDF] border-[#009BDF] hover:bg-[#EAF6FB] transition'
            }
          `}
          >
            <Image
              src={addDoctorsIcon}
              alt='user-icon'
              className='w-[13px] h-[14px]'
            />
            <span className='hidden sm:block pt-0.5'>{t('lumifi', 'common.addDoctor')}</span>
            <span className='block sm:hidden pt-0.5'>{t('lumifi', 'common.add')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
