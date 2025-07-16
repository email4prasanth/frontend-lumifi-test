import { circleXIcon } from '@/assets/images';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Image } from '../image';
import Tooltip from '../tool-tip/Tooltip';

interface PhoneInputFieldProps {
  id?: string;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  onChange: (value: string) => void;
  onClear?: (fieldName: string) => void;
  errorMessage?: string;
  infoValues?: {
    info?: string;
    infoIcon?: React.ReactNode;
    infoText?: string;
  };
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  id,
  label,
  name,
  value,
  placeholder,
  helperText,
  required = false,
  disabled = false,
  onChange,
  onClear,
  errorMessage = '',
  infoValues,
}) => {
  // Allowed Country Codes
  const onlyCountries = ['us'];

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
      <div className={`relative ${errorMessage ? 'mt-2' : 'mt-0'}`}>
        <PhoneInput
          country={'us'}
          onlyCountries={onlyCountries}
          value={value}
          onChange={onChange}
          inputProps={{
            name,
            required,
            disabled,
            'data-testid': id,
          }}
          placeholder={errorMessage ? '' : placeholder}
          inputClass='custom-phone-input'
          inputStyle={{
            paddingLeft: '50px',
            width: '100%',
            height: '44px',
            border: `1px solid ${errorMessage ? '#DB5656' : value.length > 0 ? '#4E5053' : '#D6DBDE'}`,
            paddingRight: '12px',
            fontWeight: '500',
            color: '#4E5053',
            fontSize: '16px',
          }}
        />

        {value.length > 0 && onClear && (
          <button
            type='button'
            onClick={() => onClear(name)}
            className={`absolute right-3 top-[12px] text-[#84888C] hover:text-[#4E5053]`}
          >
            <Image
              src={circleXIcon}
              alt='Clear'
              className='w-6 h-6 cursor-pointer'
            />
          </button>
        )}

        {errorMessage && errorMessage !== '' && (
          <p className='bg-[white] px-1 py-0 uppercase text-[11px] text-[#DB5656] z-50 font-semibold absolute -top-2 left-2'>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};
