import { arrowRightIcon, closeIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { PhoneInputField } from '@/lib/ui/components/phone-input';
import { TextField } from '@/lib/ui/components/text-field';
import { H6 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { useManageUser } from '@/lumifi/hooks';
import type { RootState } from '@/store/store';
import { Form, Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Header } from '../Header';

interface SecurityFormValues {
  email: string;
  mobileNumber: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
  mobileNumber: Yup.string()
    .required('Mobile number is required')
    .test('valid-phone', 'Invalid phone number', (value) => {
      if (!value) return false;
      const digits = value.replace(/[^\d+]/g, '');
      if (digits.startsWith('+1')) {
        return digits.length === 12;
      }
      if (digits.startsWith('+44')) {
        return digits.length === 13;
      }
      return false;
    }),
});

export const SecurityEdit: React.FC = () => {
  const navigate = useNavigate();

  const { userId } = useSelector((state: RootState) => state.loginAuth);
  const { isUserFetching, userDetails, fetchUserDetails, isSecurityUpdating, updateSecurityDetail } = useManageUser();

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  const initialValues: SecurityFormValues = useMemo(() => {
    if (!userId || !userDetails) {
      return {
        email: '',
        mobileNumber: '',
      };
    }

    return {
      email: userDetails?.email_id,
      mobileNumber: userDetails?.phone_number,
    };
  }, [userId, userDetails]);

  const onComplete = (status: string) => {
    if (status === 'success') {
      navigate('/settings/security');
    }
  };

  const handleSubmit = (values: SecurityFormValues) => {
    const mapToPayload = {
      emailId: values.email,
      phoneNumber: values.mobileNumber,
    };
    updateSecurityDetail(mapToPayload, onComplete);
    console.log('Submitting form', values);
  };

  const requiredFields = ['email', 'mobileNumber'];

  return (
    <div className='container mx-auto'>
      <Header mode='edit' />
      {isUserFetching ? (
        <Loader overlay={false} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount
        >
          {({ values, handleChange, setFieldValue, errors, touched, isValid }) => {
            const handleClear = (fieldName: keyof SecurityFormValues) => setFieldValue(fieldName, '');
            const allFieldsFilled = requiredFields.every(
              (field) => values[field as keyof SecurityFormValues]?.trim() !== ''
            );

            return (
              <Form className='pt-2 sm:pt-10 space-y-10 sm:max-w-[600px] mx-auto'>
                <TextField
                  label='Login Email'
                  required
                  name='email'
                  value={values.email}
                  placeholder='Enter your email'
                  type='email'
                  onChange={handleChange}
                  onClear={() => handleClear('email')}
                  errorMessage={touched.email && errors.email ? errors.email : ''}
                />

                <div className='mb-6'>
                  <H6 className='text-sm font-semibold text-[#84888C] mb-1 tracking-widest uppercase'>Password:</H6>
                  <div>
                    <a
                      href={'/'}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#009BDF] hover:underline cursor-pointer'
                    >
                      Reset Password
                    </a>
                    <p className='text-sm text-gray-500 mt-1'>Last reset on 3/4/2025</p>
                  </div>
                </div>

                <PhoneInputField
                  label='Mobile phone number'
                  name='mobileNumber'
                  value={values.mobileNumber}
                  placeholder='Enter your mobile number'
                  required
                  onChange={(phone) => {
                    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                    setFieldValue('mobileNumber', formattedPhone);
                  }}
                  onClear={() => handleClear('mobileNumber')}
                  errorMessage={touched.mobileNumber && errors.mobileNumber ? errors.mobileNumber : ''}
                />

                <div className='flex justify-center items-center gap-5 w-full pt-6'>
                  <button
                    data-testid='cancelButton'
                    onClick={() => navigate(-1)}
                    type='button'
                    disabled={isSecurityUpdating}
                    className='flex justify-center items-center text-lg font-medium gap-1 text-[#009BDF] w-28 h-10 cursor-pointer focus:outline-none disabled:cursor-not-allowed'
                  >
                    <Image
                      src={closeIcon}
                      alt='close-icon'
                      className='w-5 h-3'
                    />
                    <span>{t('lumifi', 'common.cancel')}</span>
                  </button>

                  <button
                    data-testid='nextButton'
                    type='submit'
                    disabled={!allFieldsFilled || !isValid || isSecurityUpdating}
                    className='flex justify-center items-center gap-3 text-lg font-medium bg-[#009BDF] text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                  >
                    {isSecurityUpdating ? (
                      <ButtonLoader size={20} />
                    ) : (
                      <>
                        <span>{t('lumifi', 'common.save')}</span>
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
      )}
    </div>
  );
};
