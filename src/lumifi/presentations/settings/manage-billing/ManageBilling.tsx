import { H2, H5 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import type { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Header } from './Header';

const stripeDashboardUrl = import.meta.env.VITE_STRIPE_DASHBOARD_URL;

export const ManageBilling: React.FC = () => {
  const role = useSelector((state: RootState) => state.me.details?.role);
  const hasStripeAccess = role === 'Account Owner' || role === 'Admin';

  return (
    <div className='container mx-auto'>
      <Header />
      <div className='text-center mb-6'>
        <H2 className='mb-6'> {t('lumifi', 'manageBilling.title1')}</H2>
        <H5 className='text-sm text-gray-500'> {t('lumifi', 'manageBilling.title2')}</H5>
      </div>

      <div className='text-center'>
        <a
          href={stripeDashboardUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <button
            disabled={!hasStripeAccess}
            className='flex justify-center items-center gap-3 bg-[#009BDF] text-lg font-medium text-white w-[50%] mx-auto h-10 rounded-[4px] focus:outline-none  disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
          >
            {t('lumifi', 'manageBilling.manageBillingBtn')}
          </button>
        </a>
      </div>
    </div>
  );
};
