import { arrowRightIcon, bellIcon, circleXIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import React, { useState } from 'react';

type Notification = {
  id: number;
  text: string;
  date: string;
  read: boolean;
};

type NotificationProps = {
  showNotifications: boolean;
  handleNotification: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
};

const mockData: Notification[] = [
  {
    id: 1,
    text: 'Your dental implant consultation is scheduled for 12 Feb, 2025 at 10:00 AM.',
    date: '12 Feb, 2025',
    read: false,
  },
  {
    id: 2,
    text: 'Your dental implant procedure has been confirmed for 20 Feb, 2025. Please check your email for details.',
    date: '20 Feb, 2025',
    read: false,
  },
  {
    id: 3,
    text: "It's been 6 months since your last dental cleaning. Schedule an appointment today!",
    date: '01 Mar, 2025',
    read: false,
  },
  {
    id: 4,
    text: 'Your dental X-ray results are available. Please review them before your next appointment on 15 Mar, 2025.',
    date: '10 Mar, 2025',
    read: true,
  },
  {
    id: 5,
    text: 'Your dental implant fitting has been rescheduled to 05 Apr, 2025 at 3:00 PM.',
    date: '02 Apr, 2025',
    read: false,
  },
  {
    id: 6,
    text: 'Your follow-up appointment for your dental implant healing process is on 22 Apr, 2025.',
    date: '18 Apr, 2025',
    read: true,
  },
  {
    id: 7,
    text: 'Get 10% off on your next teeth whitening session. Book before 30 Apr, 2025.',
    date: '20 Apr, 2025',
    read: true,
  },
  {
    id: 8,
    text: 'We have an early cancellation slot available for tomorrow at 2:00 PM. Call now to book!',
    date: '25 Apr, 2025',
    read: false,
  },
  {
    id: 9,
    text: 'Your dental implant healing guide is now available. Follow the instructions for a smooth recovery.',
    date: '30 Apr, 2025',
    read: true,
  },
  {
    id: 10,
    text: 'It’s time for your annual dental implant maintenance checkup. Schedule your visit today!',
    date: '05 May, 2025',
    read: false,
  },
];

export const Notification: React.FC<NotificationProps> = ({ showNotifications, handleNotification, dropdownRef }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockData);

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Sort: unread first, then read
  const notificationsData = [...notifications].sort((a, b) => Number(a.read) - Number(b.read));

  return (
    <div
      className='relative mt-2'
      ref={dropdownRef}
    >
      <button
        className='relative focus:outline-none cursor-pointer'
        onClick={handleNotification}
      >
        <Image
          src={bellIcon}
          alt='bell-icon'
          className='w-6 h-6'
        />
        {notifications.some((n) => !n.read) && (
          <div className=' bg-[#DB5656]  -right-3 w-[18px] h-[20px] mr-1 flex justify-center items-center rounded-full text-white text-[10px] font-semibold absolute -top-3 -end-1 translate-x-1/4 text-nowrap'>
            {notifications.filter((n) => !n.read).length}
          </div>
        )}
      </button>

      {showNotifications && (
        <div className='absolute right-0 top-full mt-2 w-80 bg-white shadow-md rounded-md z-50 overflow-hidden'>
          <div className='px-4 py-3 text-base font-medium text-[#4E5053]'>Notification</div>
          <div className='max-h-80 border-t border-[#D6DBDE] overflow-y-auto'>
            {notificationsData.length > 0 ? (
              notificationsData.map((notification) => (
                <div
                  key={notification.id}
                  className='px-4 py-3 border-b border-[#D6DBDE] flex justify-between items-center'
                >
                  <div className={`w-[90%] ${notification.read ? 'opacity-50' : 'opacity-100'}`}>
                    <p className='text-sm font-medium text-[#4E5053]'>{notification.text}</p>
                    <span className='text-xs font-normal text-[#848586]'>{notification.date}</span>
                  </div>
                  <button
                    className='focus:outline-none w-[10%] flex justify-end'
                    onClick={() =>
                      !notification.read ? markAsRead(notification.id) : deleteNotification(notification.id)
                    }
                  >
                    {!notification.read ? (
                      <Image
                        src={arrowRightIcon}
                        alt='arrow-right'
                        className='w-5 h-5'
                      />
                    ) : (
                      <Image
                        src={circleXIcon}
                        alt='arrow-right'
                        className='w-5 h-5'
                      />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className='text-sm px-4 font-medium text-[#4E5053] h-24 flex justify-start items-center'>
                No notifications found!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
