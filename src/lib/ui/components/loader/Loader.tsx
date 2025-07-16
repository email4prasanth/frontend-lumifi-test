import React from 'react';

interface LoaderProps {
  overlay?: boolean; // true = full screen, false = inline
}

export const Loader: React.FC<LoaderProps> = ({ overlay = true }) => {
  if (overlay) {
    // Full page loader
    return (
      <div
        data-testid='loader-container'
        className='fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm transition-opacity duration-300'
      >
        <div className='relative flex flex-col items-center'>
          <div
            data-testid='loader-spinner'
            className='h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#009BDF] animate-spin'
          />
          <div
            data-testid='loader-text'
            className='mt-2 text-gray-700 text-sm font-medium animate-pulse'
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Inline loader
  return (
    <div
      data-testid='loader-container'
      className='relative flex items-center justify-center w-full min-h-[120px]'
    >
      <div
        data-testid='loader-inline-background'
        className='absolute inset-0 bg-white/50 backdrop-blur-sm rounded'
      />
      <div className='relative flex flex-col items-center z-10'>
        <div
          data-testid='loader-spinner'
          className='h-10 w-10 rounded-full border-4 border-gray-300 border-t-[#009BDF] animate-spin'
        />
        <div
          data-testid='loader-text'
          className='mt-2 text-gray-700 text-sm font-medium animate-pulse'
        >
          Loading...
        </div>
      </div>
    </div>
  );
};
