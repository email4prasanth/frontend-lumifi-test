import { arrowDownIcon, arrowUpIcon, lumifiLogo, userProfileIcon, userRoundIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { clearUser } from '@/store/slices';
import { persistor, type RootState } from '@/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Notification } from './Notification';

export const AppHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userDetail = useSelector((state: RootState) => state.me.details);
  const userName = userDetail?.first_name + ' ' + userDetail?.last_name;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotification = () => {
    setShowNotifications(!showNotifications);
    setIsOpen(false);
  };

  const handleProfileMenu = () => {
    setIsOpen(!isOpen);
    setShowNotifications(false);
  };

  const handleLogOut = () => {
    dispatch(clearUser());
    persistor.purge();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Home', path: '/home' },
    { label: 'My Patients', path: '/patients' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Settings', path: '/settings' },
    { label: 'Support', path: '/support' },
  ];

  return (
    <header
      style={{ background: 'linear-gradient(0deg, #FFFFFF 0%, #E6F5FD 100%)' }}
      className='flex-shrink-0'
    >
      <div className='container mx-auto px-4 sm:px-8 h-[90px] flex justify-between items-center'>
        <div
          className='w-[90px] h-9 cursor-pointer'
          onClick={() => navigate('/home')}
        >
          <Image
            src={lumifiLogo}
            alt='Lumifi Logo'
            className='w-full'
            data-testid='header-logo'
          />
        </div>
        <div
          className='flex items-center gap-3 relative'
          ref={dropdownRef}
        >
          <span className='text-[#4E5053] text-lg font-medium hidden md:inline'>{`Welcome ${userName}`}</span>

          <Notification
            showNotifications={showNotifications}
            handleNotification={handleNotification}
            dropdownRef={dropdownRef}
          />

          <button
            onClick={handleProfileMenu}
            className='flex items-center gap-1 px-2 focus:outline-none'
          >
            <Image
              src={userProfileIcon}
              alt='Lumifi Logo'
              className='w-8 h-8'
            />
            {isOpen ? (
              <>
                <Image
                  src={arrowUpIcon}
                  alt='arrow-down-icon'
                  className='w-[8px] h-[6px]'
                />
              </>
            ) : (
              <Image
                src={arrowDownIcon}
                alt='arrow-up-icon'
                className='w-[8px] h-[6px]'
              />
            )}
          </button>

          {isOpen && (
            <div className='absolute right-0 top-full mt-2 w-48 sm:w-[180px] rounded-md bg-white shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)] z-50'>
              <div
                className='py-1 px-3 flex flex-col'
                role='menu'
              >
                <div className='flex items-center gap-2 px-4 py-2 text-[#4E5053] text-base font-medium border-b-2 border-[#F1F1F1] md:hidden'>
                  <Image
                    src={userRoundIcon}
                    alt='arrow-up-icon'
                    className='w-5 h-5'
                  />
                  <span className='pt-1'>Dr. Brinton</span>
                </div>
                {menuItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `w-full text-left px-4 py-2 text-base border-b-2 border-[#F1F1F1] hover:font-semibold ${
                        isActive ? 'text-[#005399] font-semibold' : 'text-[#4E5053] font-medium'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogOut}
                  className={`w-full text-left px-4 py-2 text-red-500 text-base font-medium hover:font-semibold focus:outline-none cursor-pointer`}
                  role='menuitem'
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
