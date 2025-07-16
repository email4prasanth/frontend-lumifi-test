import { chevronDownIcon, searchIcon } from '@/assets/images';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from '../image';

type AutocompleteOption = {
  label: string;
  value: string | number;
};

interface AutocompleteProps {
  options: AutocompleteOption[];
  onSelect: (value: AutocompleteOption) => void;
  placeholder?: string;
  selectedOption?: AutocompleteOption | null;
  maxWidth?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options = [],
  onSelect = () => {},
  placeholder = 'Search...',
  selectedOption = null,
  maxWidth = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(options);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuWidth, setMenuWidth] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on input value
  useEffect(() => {
    if (inputValue === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
      setFilteredOptions(filtered);
    }
    setActiveIndex(-1);
  }, [inputValue, options]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
        setInputValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set menu width
  useEffect(() => {
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    setInputValue('');
  };

  const handleSelect = (option: AutocompleteOption) => {
    onSelect(option);
    setIsOpen(false);
    setInputValue('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        setInputValue('');
        break;
    }
  };

  return (
    <div
      className='relative inline-block text-left w-full'
      ref={dropdownRef}
    >
      <div data-testid='autocomplete-menu'>
        <button
          data-testid='autocomplete-toggle'
          type='button'
          ref={buttonRef}
          className={`${maxWidth ? `w-[${maxWidth}]` : 'w-full'} inline-flex justify-between items-center px-3 h-11 border ${
            selectedOption ? 'border-[#4E5053] text-[#4E5053]' : 'border-[#D6DBDE] text-[#BBC0C3]'
          } text-base font-medium leading-4 rounded-[4px] focus:outline-none`}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup='true'
        >
          <p className='max-w-[80%] truncate'>{selectedOption ? selectedOption.label : placeholder}</p>
          <Image
            src={chevronDownIcon}
            alt='Down Arrow'
            className={`ml-2 h-[11px] w-[10px] text-[#84888C] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          style={{ width: menuWidth || undefined }}
          className={`${maxWidth ? `min-w-[${maxWidth}]` : 'min-w-56'} w-full max-h-52 overflow-auto absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none`}
          role='menu'
          aria-orientation='vertical'
          tabIndex={-1}
        >
          {/* Search input inside dropdown */}
          <div className='sticky top-0 z-10 bg-white p-2 border-b border-gray-200'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Image
                  src={searchIcon}
                  alt='Search'
                  className='h-4 w-4 text-gray-400'
                />
              </div>
              <input
                ref={inputRef}
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Search...'
                className='w-full pl-10 pr-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-[4px] focus:outline-none'
                data-testid='autocomplete-input'
              />
            </div>
          </div>

          <div className='py-1'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  data-testid={`autocomplete-option-${index}`}
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-[#D6DBDE] border-b ${
                    index === activeIndex ? 'bg-blue-50' : ''
                  }`}
                  role='menuitem'
                  tabIndex={-1}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div
                data-testid='autocomplete-no-options'
                className='block px-4 py-6 text-center text-sm text-gray-500'
              >
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
