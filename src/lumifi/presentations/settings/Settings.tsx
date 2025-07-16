import { chevronLeftIcon, deleteIcon, lumifiLogo, menuIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { getMenuItems } from '@/lumifi/types/settings-types';
import type { RootState } from '@/store/store';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const getBasePath = (path: string) => {
  const segments = path?.split('/').filter(Boolean);
  return `/${segments[0] || ''}/${segments[1] || ''}`;
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const userRole = useSelector((state: RootState) => state.me.details?.role);
  const isAccountOwner = userRole === 'Account Owner';
  const settingMenuItems = useMemo(() => {
    const _settingsMenu = getMenuItems(userRole as string);
    return _settingsMenu;
  }, [userRole]);

  return (
    <div className='container mx-auto px-4 sm:px-8 mt-8 my-14 bg-white'>
      <div className='flex items-center justify-between mb-10'>
        <h1
          data-testid='settings-title'
          className='text-[28px] font-medium text-[#005399]'
        >
          Settings
        </h1>
        {!isOpen && (
          <button
            data-testid='mobile-menu-button'
            onClick={() => setIsOpen(!isOpen)}
            className='lg:hidden focus:outline-none  text-[#4E5053] font-semibold'
          >
            <Image
              src={menuIcon}
              alt={'menu-icon'}
              className='w-[20px] h-[20px]'
            />
          </button>
        )}
      </div>

      <div className='flex gap-16 relative min-h-[calc(90vh-300px)]'>
        <aside
          className={`${isOpen ? 'translate-x-0 pl-6 py-5 lg:pl-0 lg:py-0' : '-translate-x-full'} 
                            transition-transform duration-300 ease-in-out
                            fixed lg:relative left-0 top-0 h-full lg:h-auto
                            bg-white lg:bg-transparent
                            w-64 border-r-2 border-[#D6DBDE] z-50 lg:translate-x-0
                            flex flex-col`}
        >
          <div
            className='w-32 h-12 cursor-pointer block lg:hidden'
            onClick={() => navigate('/home')}
          >
            <Image
              src={lumifiLogo}
              alt={'Lumifi-logo'}
              className='w-[80%] h-auto'
            />
          </div>
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className='block lg:hidden bg-[white] rounded-full absolute top-8 -right-4 p-1.5 text-[#4E5053] focus:outline-none'
            >
              <Image
                src={chevronLeftIcon}
                alt={'arrow-left'}
                className='w-3 h-3'
              />
            </button>
          )}

          <div className='flex-1 pt-6 lg:pt-0'>
            <nav className='space-y-2'>
              {settingMenuItems?.map(({ key, name, link, icon }) => {
                const currentBasePath = getBasePath(location.pathname);
                const menuItemBasePath = getBasePath(link as string);
                const isActive = currentBasePath === menuItemBasePath;

                return (
                  <NavLink
                    data-testid={`settings-nav-${key}`}
                    key={key}
                    to={link || ''}
                    end={key === 'Practice Info'}
                    className={`w-full flex items-center gap-3 py-2 text-base group ${
                      isActive ? 'text-[#005399] font-medium' : 'text-[#84888C]'
                    }`}
                  >
                    <div className='w-[18px] h-[18px]p-1 flex items-center justify-center'>
                      <Image
                        src={icon}
                        alt={`${key}-icon`}
                        className={`w-full h-full object-contain transition-all duration-200 ${
                          isActive
                            ? 'filter-[brightness(0)_saturate(100%)_invert(26%)_sepia(94%)_saturate(658%)_hue-rotate(172deg)_brightness(94%)_contrast(101%)]'
                            : 'grayscale'
                        }`}
                      />
                    </div>
                    <span className='leading-none'>{name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className='mt-auto'>
            {isAccountOwner && (
              <button
                data-testid='delete-account-button'
                onClick={() => navigate('/settings/delete-account')}
                className='w-full flex items-center gap-3 py-2 text-base font-medium text-[#DB5656] mt-6'
              >
                <Image
                  src={deleteIcon}
                  alt={'delete-icon'}
                  className='w-3 h-4'
                />
                <span>Delete Account</span>
              </button>
            )}
          </div>
        </aside>

        <main className='flex w-full '>
          <Outlet />
        </main>

        {isOpen && (
          <div
            className='fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden'
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
