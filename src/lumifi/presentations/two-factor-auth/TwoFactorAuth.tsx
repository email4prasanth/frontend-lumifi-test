import { ButtonLoader } from '@/lib/ui/components/loader';
import { TextField } from '@/lib/ui/components/text-field';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { useUserLogin } from '@/lumifi/hooks';
import type { IUserResponse } from '@/lumifi/types';
import type { RootState } from '@/store/store';
import { Form, Formik } from 'formik';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface TwoFactorAuth {
  code: string;
}

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^\d{6}$/, t('lumifi', 'twoFactorAuth.errors.match'))
    .required(t('lumifi', 'twoFactorAuth.errors.required')),
});

export const TwoFactorAuthForm: React.FC = () => {
  const navigate = useNavigate();
  const { isTwoFaLoading, VerifyOtp, isResendOtpLoading, resendOtp } = useUserLogin();
  const { loginId, emailId, practiceAccountId, userId } = useSelector((state: RootState) => state.loginAuth);
  const { isAuthCompletionLoading, authCompletion } = useUserLogin();

  const initialValues: TwoFactorAuth = {
    code: '',
  };

  const handleResendOtp = () => {
    const payload = {
      loginId,
      emailId,
    };
    resendOtp(payload);
  };

  const onAuthComplete = ({ status, userData }: { status: string; userData?: IUserResponse }) => {
    if (status === 'success') {
      if (userData?.status === 'success') {
        navigate('/home');
      } else {
        const account =
          userData?.message === 'Your practice account is not verified'
            ? 'PA'
            : userData?.message === 'Your user account is not verified'
              ? 'UA'
              : null;
        navigate(`/verification-pending/${account}`);
      }
    }
  };

  const onOtpVerificationComplete = useCallback((status: string) => {
    if (status === 'success') {
      const payload = {
        loginId,
        emailId,
        practiceAccountId,
        userId,
      };
      authCompletion(payload, onAuthComplete);
    }
  }, []);

  const handleSubmit = (values: TwoFactorAuth) => {
    const payload = {
      loginId,
      emailId,
      otp: values.code,
    };

    VerifyOtp(payload, onOtpVerificationComplete);
  };

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='bg-white rounded-md w-full my-6 sm:my-11 max-w-[550px] p-5 sm:p-7 sm:pb-10 shadow-none sm:shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]'>
        <div className='w-full'>
          <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
            <H2 className='text-xl sm:text-2xl text-[#255294] font-medium mb-2'>
              {t('lumifi', 'twoFactorAuth.title')}
            </H2>
            <H4 className='text-[#7F7F7F] text-sm sm:text-lg leading-[22px] font-medium mb-6 break-words whitespace-pre-wrap'>
              {t('lumifi', 'twoFactorAuth.subtitle')} {emailId}
            </H4>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnMount
          >
            {({ values, handleChange, setFieldValue, errors, touched }) => {
              const handleClear = (fieldName: string) => setFieldValue(fieldName, '');
              const allFieldsFilled = Object.values(values).every((value) => value.trim() !== '');
              return (
                <Form
                  data-testid='2fa-form'
                  className='space-y-5 mt-10'
                >
                  <TextField
                    id='2fa-code-input'
                    label={t('lumifi', 'twoFactorAuth.code.label')}
                    name='code'
                    value={values.code}
                    placeholder={t('lumifi', 'twoFactorAuth.code.placeholder')}
                    required
                    onChange={handleChange}
                    onClear={handleClear}
                    type='text'
                    errorMessage={touched.code && errors.code ? errors.code : ''}
                    helperText={t('lumifi', 'twoFactorAuth.helperText')}
                  />

                  <div className='flex justify-center items-center gap-5 w-full pt-6'>
                    <button
                      data-testid='resend-button'
                      onClick={handleResendOtp}
                      type='button'
                      className='flex justify-center items-center gap-1 text-[#009BDF] text-lg font-medium w-28 h-11 focus:outline-none cursor-pointer'
                    >
                      {isResendOtpLoading ? (
                        <ButtonLoader
                          size={20}
                          color='#009BDF'
                        />
                      ) : (
                        <span>{t('lumifi', 'common.resend')}</span>
                      )}
                    </button>
                    <button
                      data-testid='submit-button'
                      type='submit'
                      disabled={!allFieldsFilled || isTwoFaLoading || isAuthCompletionLoading}
                      className='flex justify-center items-center gap-1 bg-[#009BDF] text-lg font-medium text-white w-28 h-11 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                    >
                      {isTwoFaLoading || isAuthCompletionLoading ? (
                        <ButtonLoader size={20} />
                      ) : (
                        <span>{t('lumifi', 'common.login')}</span>
                      )}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};
