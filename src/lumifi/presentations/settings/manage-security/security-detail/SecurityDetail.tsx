import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { H4, H6 } from '@/lib/ui/components/typography';
import { useManageUser, usePassword } from '@/lumifi/hooks';
import type { RootState } from '@/store/store';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../Header';

export const SecurityDetail: React.FC = () => {
  const userDetail = useSelector((state: RootState) => state.me?.details);
  const email_id = userDetail?.email_id;
  const userId = userDetail?.id;
  const { isUserFetching, userDetails, fetchUserDetails } = useManageUser();
  const { isSendingResetLink, sendResetPasswordLink } = usePassword();

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  const handleResetPassword = () => {
    sendResetPasswordLink(email_id as string);
  };

  // Reusable InfoSection component
  const InfoSection = ({ title, content }: { title: string; content: string | React.ReactNode }) => (
    <div className='mb-6'>
      <H6 className='text-sm font-semibold text-[#84888C] mb-1 tracking-widest uppercase'>{title}:</H6>
      <H4 className='text-[#4E5053] text-lg font-medium'>{content || '-'}</H4>
    </div>
  );

  return (
    <div className='container mx-auto'>
      <Header mode='detail' />

      {isUserFetching ? (
        <Loader overlay={false} />
      ) : (
        <div className='space-y-10 mt-8'>
          <div>
            <h4 className='text-xl font-semibold text-[#4E5053] mb-2'>Login Information</h4>
          </div>
          <InfoSection
            title='EMAIL ADDRESS'
            content={
              <div>
                <p>{userDetails?.email_id}</p>
                <p className='text-sm text-gray-500 mt-1'>Email ID to receive authentication codes via E-MAIL</p>
              </div>
            }
          />

          <InfoSection
            title='PASSWORD'
            content={
              <div>
                <button
                  onClick={handleResetPassword}
                  className='text-[#009BDF] hover:underline'
                >
                  {isSendingResetLink ? (
                    <ButtonLoader
                      size={20}
                      color='#009BDF'
                    />
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
                <p className='text-sm text-gray-500 mt-1'>
                  {userDetails?.is_password_reset
                    ? `Last reset on ${dayjs(userDetails?.password_reset_at).format('MM-DD-YYYY')}`
                    : null}
                </p>
              </div>
            }
          />

          <InfoSection
            title='MOBILE NUMBER'
            content={userDetails?.phone_number}
          />
        </div>
      )}
    </div>
  );
};
