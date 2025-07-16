import { lumifiFooterLogo } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import React from 'react';
import { LUMIFI_FOOTER_ITEMS } from '../types';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className='w-full h-auto sm:h-20 bg-[#F9F9F9]'>
        <div className='container mx-auto h-full flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4'>
          <div className='w-20 h-9 mb-4 sm:mb-0'>
            <Image
              src={lumifiFooterLogo}
              alt='Lumifi Logo'
              className='w-full h-full'
              data-testid='lumifi-logo'
            />
          </div>
          <div
            data-testid='footer-links'
            className='flex flex-row gap-2 pb-3 sm:pb-0 sm:gap-4 text-sm  font-medium leading-4 text-[#C1C1C1] items-center'
          >
            {LUMIFI_FOOTER_ITEMS.map((item, index) => (
              <React.Fragment key={item.key}>
                <a
                  data-testid={`footer-link-${item.key}`}
                  href={item.link}
                  className='hover:text-[#009BDF]'
                >
                  {item.name}
                </a>
                {index < LUMIFI_FOOTER_ITEMS.length - 1 && <span data-testid='footer-divider'>|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
