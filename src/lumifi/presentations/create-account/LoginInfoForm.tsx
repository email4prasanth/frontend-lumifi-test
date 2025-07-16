import { arrowRightIcon, closeIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader } from '@/lib/ui/components/loader';
import { PhoneInputField } from '@/lib/ui/components/phone-input';
import { TextField } from '@/lib/ui/components/text-field';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { useCreatePractice } from '@/lumifi/hooks';

import type { LoginInfo } from '@/lumifi/types';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface LoginInfoFormProps {
  onNext: (data: LoginInfo) => void;
  initialEmail?: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address')
    .required(t('lumifi', t('lumifi', 'loginInfo.errors.email.required'))),
  password: Yup.string()
    .min(8, t('lumifi', 'loginInfo.errors.password.min'))
    .matches(/(?=.*[0-9])/, t('lumifi', 'loginInfo.errors.password.number'))
    .matches(/(?=.*[!@#$%^&*])/, t('lumifi', 'loginInfo.errors.password.symbol'))
    .required(t('lumifi', 'loginInfo.errors.password.required')),
  mobileNumber: Yup.string()
    .test('valid-phone', t('lumifi', 'loginInfo.errors.mobileNumber.invalid'), (value) => {
      if (!value) return true;
      const digits = value.replace(/[^\d+]/g, '');
      if (digits.startsWith('+1')) {
        return digits.length === 12;
      }
      if (digits.startsWith('+44')) {
        return digits.length === 13;
      }
      return false;
    })
    .nullable(),
});

export const LoginInfoForm = React.memo(({ onNext, initialEmail }: LoginInfoFormProps) => {
  const navigate = useNavigate();
  const { checkAccountAdminAvailability } = useCreatePractice();
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const initialValues: LoginInfo = {
    email: initialEmail as string,
    password: '',
    mobileNumber: '',
    twoFactorAuthEnabled: false,
  };

  const handleSubmit = async (values: LoginInfo) => {
    setIsChecking(true);
    const data = await checkAccountAdminAvailability(values.email);
    if (data.status === 'success') {
      setIsChecking(false);
      onNext(values);
    }

    if (data.status === 'failure') {
      setIsChecking(false);
      toast.warn(t('lumifi', 'practiceAccount.practiceEmailAlreadyExists'));
    }
  };

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
        <H2
          data-testid='login-title'
          className='text-xl sm:text-2xl text-[#255294] font-medium mb-2'
        >
          {t('lumifi', 'loginInfo.title')}
        </H2>
        <H4
          data-testid='login-subtitle'
          className='text-[#4B4B4B] text-sm sm:text-lg leading-[22px] font-medium italic mb-6 break-words whitespace-pre-wrap max-w-[350px]'
        >
          {t('lumifi', 'loginInfo.subtitle')}
        </H4>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
        enableReinitialize
      >
        {({ values, handleChange, setFieldValue, errors, touched }) => {
          const handleClear = (fieldName: string) => setFieldValue(fieldName, '');
          const requiredFieldsFilled = ['email', 'password'].every(
            // (field) => values[field as keyof LoginInfo]?.trim() !== ''
            (field) => (values[field as 'email' | 'password'] as string).trim() !== ''
          );
          return (
            <Form className='space-y-5 mt-10'>
              <TextField
                id='login-email'
                label={t('lumifi', 'loginInfo.email.label')}
                name='email'
                value={values.email}
                placeholder={t('lumifi', 'loginInfo.email.placeholder')}
                required
                onChange={handleChange}
                onClear={handleClear}
                type='email'
                readOnly={true}
                errorMessage={touched.email && errors.email ? errors.email : ''}
              />

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='twoFactorAuthEnabled'
                  name='twoFactorAuthEnabled'
                  checked={values.twoFactorAuthEnabled}
                  onChange={(e) => setFieldValue('twoFactorAuthEnabled', e.target.checked)}
                  className='w-[18px] h-[18px] cursor-pointer accent-[#009BDF] rounded'
                />
                <label
                  htmlFor='twoFactorAuthEnabled'
                  className='text-sm font-medium text-[#4E5053] italic'
                >
                  {t('lumifi', 'loginInfo.enableTwoFactor')}
                </label>
              </div>

              <TextField
                id='login-password'
                label={t('lumifi', 'loginInfo.password.label')}
                name='password'
                value={values.password}
                placeholder={t('lumifi', 'loginInfo.password.placeholder')}
                required
                onChange={handleChange}
                showPasswordToggle
                // onClear={handleClear}
                type='password'
                helperText={t('lumifi', 'loginInfo.password.helperText')}
                errorMessage={touched.password && errors.password ? errors.password : ''}
              />

              <PhoneInputField
                id='login-mobile-number'
                label={t('lumifi', 'loginInfo.mobileNumber.label')}
                name='mobileNumber'
                value={values.mobileNumber}
                placeholder={t('lumifi', 'loginInfo.mobileNumber.placeholder')}
                onChange={(phone) => {
                  const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                  setFieldValue('mobileNumber', formattedPhone);
                }}
                onClear={handleClear}
                // helperText={t('lumifi', 'loginInfo.mobileNumber.helperText')}
                errorMessage={touched.mobileNumber && errors.mobileNumber ? errors.mobileNumber : ''}
              />

              <div className='flex justify-center items-center gap-5 w-full pt-6'>
                <button
                  data-testid='cancel-button'
                  onClick={() => navigate('/login')}
                  type='button'
                  className='flex justify-center items-center gap-1 text-[#009BDF] text-lg font-medium w-28 h-10 focus:outline-none disabled:cursor-not-allowed'
                >
                  <Image
                    src={closeIcon}
                    alt='close-icon'
                    className='w-5 h-3'
                  />
                  <span>{t('lumifi', 'common.cancel')}</span>
                </button>
                <button
                  data-testid='next-button'
                  type='submit'
                  disabled={!requiredFieldsFilled || isChecking}
                  className='flex justify-center items-center gap-3 bg-[#009BDF] text-lg font-medium text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                >
                  {isChecking ? (
                    // <span>Checking</span>
                    <ButtonLoader size={18} />
                  ) : (
                    <>
                      <span>{t('lumifi', 'common.next')}</span>
                      <Image
                        src={arrowRightIcon}
                        alt='arrow-right'
                        className='w-2 h-3'
                      />
                    </>
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
});
