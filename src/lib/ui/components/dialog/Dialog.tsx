import { alertCircleIcon, closeIcon, trashIcon } from '@/assets/images';
import { t } from '@/lib/utils';
import React from 'react';
import { Image } from '../image';

interface DialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  isDeleting?: boolean;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const Dialog = React.memo(({ isOpen, isProcessing, title, message, onCancel, onConfirm }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className='inset-0 flex items-center justify-center md:p-4'>
      <div className='w-full md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)] mt-4 sm:mt-0 p-6 sm:p-8'>
        <div className='flex flex-col items-center space-y-4'>
          <h3 className='text-lg sm:text-2xl font-medium text-[#4E5053] flex items-center gap-2'>
            <Image
              src={alertCircleIcon}
              alt='alertCircle'
              className='h-5 w-5 sm:h-7 sm:w-7'
            />
            {title}
          </h3>
          <p className='text-sm md:text-base lg:text-lg text-center text-[#4E5053] font-medium sm:max-w-[70%]'>
            {message}
          </p>
        </div>

        <div className='h-[2px] bg-[#005399] w-full my-8' />

        <div className='flex justify-center items-center gap-3 sm:gap-4'>
          <button
            disabled={isProcessing}
            onClick={onCancel}
            className=':w-auto flex items-center justify-center text-[#009BDF]  text-lg font-medium cursor-pointer px-6 h-11 rounded-[4px] disabled:cursor-not-allowed'
          >
            <Image
              src={closeIcon}
              alt='alertCircle'
              className='mr-2 h-5 w-5'
            />
            <span>{t('lumifi', 'common.cancel')}</span>
          </button>
          <button
            disabled={isProcessing}
            onClick={onConfirm}
            className='flex items-center justify-center bg-[#DB5656] text-lg text-white px-6 w-auto h-10 rounded-[4px] cursor-pointer hover:bg-[#c94c4c] focus:outline-none  disabled:cursor-not-allowed'
          >
            <Image
              src={trashIcon}
              alt='alertCircle'
              className='mr-2 h-5 w-5'
            />

            <span>{t('lumifi', `${isProcessing ? 'Deleting...' : 'common.delete'}`)}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
