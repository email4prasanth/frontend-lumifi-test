import React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<TypographyProps> = ({ children, className = '', ...props }) => (
  <h1
    className={`text-[28px] leading-[32.2px] font-medium align-middle tracking-normal ${className}`}
    {...props}
  >
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className = '', ...props }) => (
  <h2
    className={`text-[24px] leading-[27.6px] font-medium align-middle tracking-normal ${className}`}
    {...props}
  >
    {children}
  </h2>
);

export const H3: React.FC<TypographyProps> = ({ children, className = '', ...props }) => (
  <h3
    className={`text-[20px] leading-[25px] font-semibold align-middle tracking-normal ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const H4: React.FC<TypographyProps> = ({ children, className = '', ...props }) => (
  <h4
    className={`text-[18px] leading-[27px] font-medium align-middle tracking-normal ${className}`}
    {...props}
  >
    {children}
  </h4>
);

export const H5: React.FC<TypographyProps> = ({ children, className = '', ...props }) => (
  <h5
    className={`text-[16px] leading-[20px] font-medium align-middle tracking-normal ${className}`}
    {...props}
  >
    {children}
  </h5>
);

export const H6: React.FC<TypographyProps> = ({ children, className = '', ...props }) => (
  <h6
    className={`text-[14px] leading-[17.5px] font-semibold align-middle tracking-normal ${className}`}
    {...props}
  >
    {children}
  </h6>
);
