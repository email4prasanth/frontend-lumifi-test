import { pencilIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { H3 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  mode: 'detail' | 'edit';
}

export const Header: React.FC<HeaderProps> = ({ mode }) => {
  const navigate = useNavigate();
  const getTitle = () => {
    const mapTitle = {
      detail: t('lumifi', 'manageSecurity.header.securityDetail'),
      edit: t('lumifi', 'manageSecurity.header.securityEdit'),
    };
    return mapTitle[mode] || t('lumifi', 'manageSecurity.header.securityDetail');
  };

  const isButtonDisabled = mode !== 'detail';

  return (
    <div className='flex justify-between items-center mb-2 border-b-[3px] border-[#D6DBDE] py-4'>
      <H3 className='text-xl sm:text-2xl font-semibold text-[#4E5053]'>{getTitle()}</H3>
      <div className='flex justify-between items-center'>
        {mode === 'detail' && (
          <button
            onClick={() => navigate('/settings/security/edit')}
            disabled={isButtonDisabled}
            className={`flex justify-center items-center gap-2 px-3 h-9 font-medium text-base  cursor-pointer whitespace-nowrap
            ${
              isButtonDisabled
                ? 'border-gray-[text-[#009BDF] text-[#009BDF] cursor-not-allowed bg-gray-50'
                : 'text-[#009BDF] border-[#009BDF] '
            }
          `}
          >
            <Image
              src={pencilIcon}
              alt='pencil-icon'
              className='w-5 h-5'
            />
            <span>{t('lumifi', 'common.edit')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
