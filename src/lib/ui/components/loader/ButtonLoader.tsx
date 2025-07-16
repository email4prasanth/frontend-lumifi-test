import React from 'react';

interface ButtonLoaderProps {
  size?: number;
  color?: string;
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({ size = 16, color = '#FFFFFF' }) => {
  return (
    <div
      className='inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]'
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderColor: color,
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderWidth: `${Math.max(2, size / 8)}px`,
      }}
      role='status'
    >
      {/* <span className='sr-only'>Loading...</span> */}
    </div>
  );
};
