import { chevronDownIcon, chevronLeftIcon, chevronRightIcon } from '@/assets/images';
import type { IPaginationProps } from '@/lumifi/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image } from '../image';

const ROWS_RANGE: DropdownOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
];

const DEFAULT_LIMIT = 5;
const DEFAULT_PAGE = 1;

type DropdownOption = {
  label: string;
  value: number;
};

export const TablePagination = React.memo(({ handlePagination, paginationData }: IPaginationProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalPages = paginationData?.totalPages ?? 0;
  const currentPage = paginationData?.currentPage ?? DEFAULT_PAGE;
  const rowsPerPage = paginationData?.rowsPerPage ?? DEFAULT_LIMIT;

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const pageNumbersSeries = useMemo(() => {
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage <= 3) {
      startPage = 2;
      endPage = 4;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
      endPage = totalPages - 1;
    }
    if (startPage > 2) {
      pages.push('...');
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
    return pages;
  }, [paginationData]);

  const handleOnPageChange = (page: number) => {
    // do not trigger pagination if the page is the same
    if (page === currentPage) {
      return;
    }
    handlePagination(page, rowsPerPage);
  };

  const handleOnRowsPerPageChange = (rowPerPage: number) => {
    // do not trigger pagination if the rows per page is the same
    if (rowPerPage === rowsPerPage) {
      return;
    }
    handlePagination(1, rowPerPage);
  };

  return (
    <div className='pt-4 flex justify-between items-center border-t border-gray-100'>
      <div className='flex items-center gap-2'>
        <button
          id='previous-page'
          onClick={() => {
            handleOnPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className='w-8 h-8 flex items-center justify-center disabled:opacity-30 cursor-pointer'
          aria-label='Previous page'
        >
          <Image
            src={chevronLeftIcon}
            alt='chevron-left'
            className='w-2 h-2p-2'
          />
        </button>

        <div className='flex items-center'>
          {pageNumbersSeries.map((page, index) => (
            <div
              key={index}
              className='flex items-center'
            >
              {typeof page === 'number' ? (
                <button
                  onClick={() => {
                    handleOnPageChange(page);
                  }}
                  className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
                    currentPage === page ? 'text-[#005399] font-semibold' : 'text-[#84888C]'
                  }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ) : (
                <span className='w-8 h-8 flex items-center justify-center text-[#84888C]'>...</span>
              )}
              {index < pageNumbersSeries.length - 1 && <span className='text-[#D6DBDE] mx-1'>|</span>}
            </div>
          ))}
        </div>

        <button
          id='next-page'
          onClick={() => {
            handleOnPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className='w-8 h-8 flex items-center justify-center disabled:opacity-30 cursor-pointer'
          aria-label='Next page'
        >
          <Image
            src={chevronRightIcon}
            alt='chevron-left'
            className='w-2 h-2p-2'
          />
        </button>
      </div>

      <div className='flex items-center gap-2  text-sm text-[#475569]'>
        <span className='hidden sm:inline'>Number of results per page:</span>
        <div
          className='relative inline-block text-left '
          ref={dropdownRef}
        >
          <div className='relative  w-[75px]'>
            <button
              type='button'
              className='inline-flex justify-between items-center px-3 h-8 border border-[#D6DBDE] text-[#4E5053] text-base font-medium leading-4 rounded-[4px] w-full'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup='true'
            >
              <span className='truncate'>{rowsPerPage}</span>
              <Image
                src={chevronDownIcon}
                alt='Down Arrow'
                className={`h-[11px] w-[10px] text-[#84888C] transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                className='absolute left-0 top-[calc(100%+4px)] z-50 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'
                role='menu'
                aria-orientation='vertical'
              >
                <div className='py-1'>
                  {ROWS_RANGE.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleOnRowsPerPageChange(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        option.value === rowsPerPage ? 'bg-[#005399] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role='menuitem'
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
