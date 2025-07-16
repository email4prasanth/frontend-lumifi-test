import { chevronDownIcon } from '@/assets/images';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from '../image';

type DropdownOption = {
  id?: string;
  label: string;
  value: string | number;
};

interface DropdownProps {
  id?: string;
  options: DropdownOption[];
  onSelect: (value: DropdownOption) => void;
  placeholder?: string;
  selectedOption?: DropdownOption | null;
  maxWidth?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  id = '',
  options = [],
  onSelect = () => {},
  placeholder = 'Select options',
  selectedOption = null,
  maxWidth = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuWidth, setMenuWidth] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: DropdownOption) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div
      data-testid={id}
      className='relative inline-block text-left w-full'
      ref={dropdownRef}
    >
      <div data-testid='dropdown-menu'>
        <button
          data-testid='dropdown-toggle'
          type='button'
          ref={buttonRef}
          className={`${maxWidth ? `w-[${maxWidth}]` : 'w-full'} inline-flex justify-between items-center px-3 h-11 border ${
            selectedOption ? 'border-[#4E5053] text-[#4E5053]' : 'border-[#D6DBDE] text-[#BBC0C3]'
          } text-base font-medium leading-4 rounded-[4px] focus:outline-none`}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup='true'
        >
          <p className='max-w-[80%] truncate'>
            {selectedOption ? selectedOption.label : placeholder || 'Select one...'}
          </p>
          <Image
            src={chevronDownIcon}
            alt='Down Arrow'
            className={`ml-2 h-[11px] w-[10px] text-[#84888C] transition-transform ${isOpen ? 'rotate-180' : ''} cursor-pointer`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          style={{ width: menuWidth || undefined }}
          className={`${maxWidth ? `min-w-[${maxWidth}]` : 'min-w-56'} w-full max-h-52 overflow-auto absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5  focus:outline-none`}
          role='menu'
          aria-orientation='vertical'
          tabIndex={-1}
        >
          <div className='py-1'>
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  data-testid={`dropdown-option-${index}`}
                  key={index}
                  onClick={() => handleSelect(option)}
                  className='block border-b border-[#D6DBDE] cursor-pointer px-4 py-2 text-sm text-gray-700  hover:bg-gray-100'
                  role='menuitem'
                  tabIndex={-1}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div
                data-testid='dropdown-no-options'
                className='block px-4 py-6 text-center text-sm text-gray-500'
              >
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
