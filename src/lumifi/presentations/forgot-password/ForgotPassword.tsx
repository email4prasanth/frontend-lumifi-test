import { closeIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader } from '@/lib/ui/components/loader';
import { TextField } from '@/lib/ui/components/text-field';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { usePassword } from '@/lumifi/hooks';
import { Form, Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface Forgot {
  email: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('lumifi', 'forgotPassword.errors.invalid'))
    .required(t('lumifi', 'forgotPassword.errors.required')),
});

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { isSendingResetLink, sendResetPasswordLink } = usePassword();

  const initialValues: Forgot = {
    email: '',
  };

  const handleSubmit = (values: Forgot) => {
    sendResetPasswordLink(values.email);
  };

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='bg-white rounded-md w-full my-6 sm:my-11 max-w-[550px] p-5 sm:p-7 sm:pb-10 shadow-none sm:shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]'>
        <div className='w-full'>
          <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
            <H2 className='text-xl sm:text-2xl text-[#4E5053] font-medium mb-2'>
              {t('lumifi', 'forgotPassword.title')}
            </H2>
            <H4 className='text-[#4E5053] text-sm sm:text-lg leading-[22px] font-medium mb-6 break-words whitespace-pre-wrap'>
              {t('lumifi', 'forgotPassword.subtitle')}
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
                <Form className='space-y-5 mt-10'>
                  <TextField
                    label={t('lumifi', 'forgotPassword.email.label')}
                    name='email'
                    value={values.email}
                    placeholder={t('lumifi', 'forgotPassword.email.placeholder')}
                    required
                    onChange={handleChange}
                    onClear={handleClear}
                    type='email'
                    errorMessage={touched.email && errors.email ? errors.email : ''}
                  />

                  <div className='flex justify-center items-center gap-5 w-full pt-6'>
                    <button
                      onClick={() => navigate('/login')}
                      type='button'
                      className='flex justify-center items-center gap-1 text-[#009BDF] text-lg font-medium w-28 h-11 focus:outline-none cursor-pointer'
                    >
                      <Image
                        src={closeIcon}
                        alt='close-icon'
                        className='w-5 h-3'
                      />
                      <span>{t('lumifi', 'common.cancel')}</span>
                    </button>
                    <button
                      type='submit'
                      disabled={!allFieldsFilled}
                      className='flex justify-center items-center gap-1 bg-[#009BDF] text-lg font-medium text-white w-28 h-11 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                    >
                      {isSendingResetLink ? (
                        <ButtonLoader
                          size={20}
                          color={'white'}
                        />
                      ) : (
                        <span>{t('lumifi', 'common.reset')}</span>
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
