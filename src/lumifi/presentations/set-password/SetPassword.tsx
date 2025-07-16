import { closeIcon, tickSaveIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader } from '@/lib/ui/components/loader';
import { TextField } from '@/lib/ui/components/text-field';
import { H2 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { usePassword } from '@/lumifi/hooks';
import type { IResetPasswordPayload } from '@/lumifi/types';
import { clearUser } from '@/store/slices';
import { store } from '@/store/store';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, t('lumifi', 'setPassword.errors.password.min'))
    .matches(/(?=.*[0-9])/, t('lumifi', 'setPassword.errors.password.number'))
    .matches(/(?=.*[!@#$%^&*])/, t('lumifi', 'setPassword.errors.password.symbol'))
    .required(t('lumifi', 'setPassword.errors.password.required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], t('lumifi', 'setPassword.errors.password.match'))
    .required(t('lumifi', 'setPassword.errors.password.confpassrequired')),
});

export const SetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSettingPassword, setPassword } = usePassword();
  const initialValues: ResetPasswordValues = {
    password: '',
    confirmPassword: '',
  };

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const context = queryParams.get('context');
  const credential = queryParams.get('credential');

  const onComplete = (status: string) => {
    if (status === 'success') {
      navigate('/set-password/success', { state: { context } });
      store.dispatch(clearUser());
    }
  };

  const handleSubmit = (values: ResetPasswordValues) => {
    const payload = {
      credential: credential,
      password: values.confirmPassword,
    };
    setPassword(payload as IResetPasswordPayload, onComplete);
  };

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='bg-white rounded-md w-full my-6 sm:my-11 max-w-[550px] p-5 sm:p-7 sm:pb-10 shadow-none sm:shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]'>
        <div className='w-full'>
          <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
            <H2 className='text-xl sm:text-2xl text-[#255294] font-medium mb-6'>{t('lumifi', 'setPassword.title')}</H2>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnMount
          >
            {({ values, handleChange, errors, touched }) => {
              const allFieldsFilled = Object.values(values).every((value) => value.trim() !== '');
              return (
                <Form className='space-y-5 mt-10'>
                  <TextField
                    label={t('lumifi', 'setPassword.password.label')}
                    name='password'
                    value={values.password}
                    placeholder={t('lumifi', 'setPassword.password.placeholder')}
                    required
                    showPasswordToggle
                    onChange={handleChange}
                    type='password'
                    helperText={t('lumifi', 'setPassword.password.helperText')}
                    errorMessage={touched.password && errors.password ? errors.password : ''}
                  />

                  <TextField
                    label={t('lumifi', 'setPassword.repeatPassword.label')}
                    name='confirmPassword'
                    value={values.confirmPassword}
                    placeholder={t('lumifi', 'setPassword.repeatPassword.placeholder')}
                    required
                    showPasswordToggle
                    onChange={handleChange}
                    type='password'
                    errorMessage={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
                  />

                  <div className='flex justify-center items-center gap-5 w-full pt-6'>
                    <button
                      onClick={() => navigate(-1)}
                      type='button'
                      className='flex justify-center items-center gap-1 text-[#009BDF] text-base font-medium w-28 h-10 focus:outline-none disabled:cursor-not-allowed'
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
                      className='flex justify-center items-center gap-1 bg-[#009BDF] text-base font-medium text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                    >
                      {isSettingPassword ? (
                        <ButtonLoader
                          size={20}
                          color='white'
                        />
                      ) : (
                        <>
                          <Image
                            src={tickSaveIcon}
                            alt='close-icon'
                            className='w-5 h-3'
                          />
                          <span>{t('lumifi', 'common.save')}</span>
                        </>
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
