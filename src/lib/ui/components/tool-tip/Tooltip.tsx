// import React, { ReactNode } from "react";
import type { ReactNode } from 'react';

interface TooltipProps {
  text?: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text = '', children }) => {
  const isLongText = text.length > 20;

  return (
    <div className='group cursor-pointer relative inline-block'>
      {children}
      {text && (
        <div
          className={`opacity-0 group-hover:opacity-100 mb-2 text-gray-900 bg-white border border-gray-200 shadow-sm text-center text-xs rounded-lg py-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 px-3 pointer-events-none ${
            isLongText ? 'w-[250px] break-words whitespace-normal' : 'whitespace-nowrap'
          }`}
        >
          {text}
          <svg
            className='absolute text-gray-300 h-3 w-full left-0 top-full'
            viewBox='0 0 255 255'
          >
            <polygon
              className='fill-current'
              points='0,0 127.5,127.5 255,0'
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
