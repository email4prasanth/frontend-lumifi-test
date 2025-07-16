import { pencilIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { Loader } from '@/lib/ui/components/loader';
import { H4, H6 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { usePracticeInfo } from '@/lumifi/hooks';
import type { RootState } from '@/store/store';
import type React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const PracticeInfoDetail: React.FC = () => {
  const navigate = useNavigate();
  const practice_account_id = useSelector((state: RootState) => state.me.details?.practice_account_id);
  const isAccountOwner = useSelector((state: RootState) => state.me.details?.role === 'Account Owner');
  const { isPracticeInfoFetching, practiceInfo, getPracticeInfo } = usePracticeInfo();

  useEffect(() => {
    if (practice_account_id) {
      getPracticeInfo(practice_account_id);
    }
  }, [practice_account_id]);

  const InfoSection = ({ title, content }: { title: string; content: string | React.ReactNode }) => (
    <div>
      <H6 className='text-sm font-semibold text-[#84888C] mb-1 tracking-widest uppercase'>{title}:</H6>
      <H4 className='text-[#4E5053] text-lg font-medium'>{content || '-'}</H4>
    </div>
  );

  if (isPracticeInfoFetching) {
    return (
      <div className='container mx-auto min-h-[200px] flex items-center justify-center'>
        <Loader overlay={false} />
      </div>
    );
  }

  if (!practiceInfo) {
    return <div className='container mx-auto'>No practice information available</div>;
  }

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-6 sm:mb-10 border-b-[3px] border-[#D6DBDE] py-3'>
        <H4 className='font-semibold text-[#4E5053]'>Practice Info</H4>
        {}
        {isAccountOwner && (
          <button
            onClick={() => navigate('/settings/practice-info/edit', { state: { practiceInfo } })}
            className='flex items-center gap-2 focus:outline-none text-[#009BDF] text-lg font-medium pr-4 cursor-pointer'
          >
            <Image
              src={pencilIcon}
              alt='pencil-icon'
              className='w-5 h-5'
            />
            <span>{t('lumifi', 'common.edit')}</span>
          </button>
        )}
      </div>

      <div className='space-y-6'>
        <div>
          <h4 className='text-xl font-semibold text-[#4E5053] mb-2'>{practiceInfo.practice_name}</h4>
        </div>

        <InfoSection
          title='ADDRESS'
          content={
            <p>
              {practiceInfo.address1}, {practiceInfo.address2}
              <br /> {practiceInfo.city}, {practiceInfo.state}, {practiceInfo.zip}
            </p>
          }
        />

        <InfoSection
          title='EMAIL'
          content={practiceInfo.office_email}
        />

        <InfoSection
          title='OFFICE PHONE'
          content={practiceInfo.office_phone}
        />

        <InfoSection
          title='WEBSITE'
          content={
            practiceInfo.website_address ? (
              <a
                href={practiceInfo.website_address}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#009BDF] hover:underline'
              >
                {practiceInfo.website_address}
              </a>
            ) : (
              '-'
            )
          }
        />

        <InfoSection
          title='Practice Type'
          content={practiceInfo.speciality_name}
        />

        <InfoSection
          title='Practice Management Software:'
          content={practiceInfo.practice_software_name}
        />
      </div>
    </div>
  );
};
