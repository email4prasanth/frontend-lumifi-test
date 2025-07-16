import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const Image: React.FC<ImageProps> = ({ src, alt = '', className = '', ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      {...props}
    />
  );
};
