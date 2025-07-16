import { circleXIcon, hidepasswordIcon, showPasswordIcon } from '@/assets/images';
import React, { useState } from 'react';
import { Image } from '../image';
import Tooltip from '../tool-tip/Tooltip';

interface InfoValues {
  info?: string;
  infoIcon?: React.ReactNode;
  infoText?: string;
}

interface TextFieldProps {
  id?: string;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClear?: (fieldName: string) => void;
  type?: string;
  helperText?: string;
  errorMessage?: string;
  isMultiline?: boolean;
  infoValues?: InfoValues;
  showPasswordToggle?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  name,
  value,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  onChange,
  onClear,
  type = 'text',
  helperText,
  errorMessage = '',
  isMultiline = false,
  infoValues,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine the input type based on whether it's a password field and visibility
  const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

  // Base input classes
  const inputBaseClasses = `w-full px-3 ${isMultiline ? 'py-2.5' : 'h-11'} border ${
    errorMessage ? 'border-[#DB5656]' : value.length > 0 ? 'border-[#4E5053]' : 'border-[#D6DBDE]'
  } text-[#4E5053] placeholder:text-[#BBC0C3] text-base font-medium leading-4 rounded-[4px] focus:outline-none pr-10`;

  // Additional classes for readOnly state
  const readOnlyClasses = readOnly ? 'bg-gray-50 cursor-default' : '';

  return (
    <div className='relative'>
      <div
        className={`flex items-center ${helperText && errorMessage ? 'mb-0' : helperText ? '-mb-1' : errorMessage ? 'mb-3' : 'mb-1'}`}
      >
        <label
          htmlFor={name}
          className={`block text-base leading-5 font-semibold text-[#4E5053]`}
        >
          {label} {required && '*'}
        </label>
        {infoValues && (
          <div className='flex items-center pt-0.5 ml-1 text-[#4E5053]'>
            {infoValues.info && <span className='ml-1 text-sm'>{infoValues.info}</span>}
            {infoValues.infoIcon && infoValues.infoText ? (
              <Tooltip text={infoValues.infoText}>
                <div className='ml-1'>{infoValues.infoIcon}</div>
              </Tooltip>
            ) : (
              infoValues.infoIcon && <div className='ml-1'>{infoValues.infoIcon}</div>
            )}
          </div>
        )}
      </div>
      {helperText && (
        <span className='text-[8px] sm:text-xs italic font-normal text-[#4E5053] mb-1 text-nowrap'>{helperText}</span>
      )}
      <div className={`relative ${helperText && errorMessage ? 'mt-2' : 'mt-0'}`}>
        {isMultiline ? (
          <textarea
            data-testid={id}
            id={id ?? name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={errorMessage ? '' : placeholder}
            disabled={disabled}
            readOnly={readOnly}
            // className={`w-full px-3 py-2.5 border ${errorMessage ? 'border-[#DB5656]' : value.length > 0 ? 'border-[#4E5053]' : 'border-[#D6DBDE]'} text-[#4E5053] placeholder:text-[#BBC0C3] text-base font-medium leading-5 rounded-[4px] focus:outline-none pr-10`}
            className={`${inputBaseClasses} ${readOnlyClasses}`}
          />
        ) : (
          <input
            data-testid={id}
            type={inputType}
            id={id ?? name}
            name={name}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
            required={required}
            placeholder={errorMessage ? '' : placeholder}
            // className={`w-full px-3 h-11 border ${errorMessage ? 'border-[#DB5656]' : value.length > 0 ? 'border-[#4E5053]' : 'border-[#D6DBDE]'} text-[#4E5053] placeholder:text-[#BBC0C3] text-base font-medium leading-4 rounded-[4px] focus:outline-none pr-10`}
            className={`${inputBaseClasses} ${readOnlyClasses}`}
          />
        )}
        {value.length > 0 && !readOnly && (
          <div className='absolute right-3 top-[12px] flex items-center'>
            {/* Show password toggle if enabled and it's a password field */}
            {showPasswordToggle && type === 'password' && !readOnly && (
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='text-[#84888C] hover:text-[#4E5053] mr-2'
              >
                {showPassword ? (
                  <Image
                    src={hidepasswordIcon}
                    alt='hide password'
                    className='w-6 h-6 cursor-pointer'
                  />
                ) : (
                  <Image
                    src={showPasswordIcon}
                    alt='show password'
                    className='w-6 h-6 cursor-pointer'
                  />
                )}
              </button>
            )}
            {onClear && (!showPasswordToggle || type !== 'password') && (
              <button
                type='button'
                onClick={() => onClear(name)}
                className={`text-[#84888C] hover:text-[#4E5053]`}
              >
                <Image
                  src={circleXIcon}
                  alt='Clear'
                  className='w-6 h-6 cursor-pointer'
                />
              </button>
            )}
          </div>
        )}

        {errorMessage && errorMessage !== '' && (
          <p
            data-testid='error-message'
            className='bg-[white] px-1 py-0 uppercase text-[11px] text-[#DB5656] font-semibold absolute -top-2 left-2'
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};
