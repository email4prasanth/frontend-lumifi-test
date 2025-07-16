import { ButtonLoader } from '@/lib/ui/components/loader';
import { TextField } from '@/lib/ui/components/text-field';
import { useUserLogin } from '@/lumifi/hooks';
import { SELECT_PRACTICE_TYPE_ROUTE, TWO_FACTOR_AUTH_ROUTE } from '@/lumifi/routes';
import type {
  ILoginResponse,
  IPracticeAccountTypePayload,
  IUserPracticeTypeResponse,
  IUserResponse,
} from '@/lumifi/types';
import { setAccountDetail } from '@/store/slices';
import { Form, Formik } from 'formik';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface LoginDetails {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postUserLogin, isLoginLoading, authCompletion, selectUserPracticeAccount } = useUserLogin();

  const initialValues: LoginDetails = {
    email: '',
    password: '',
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

  const onPracticeSelectionComplete = useCallback(
    ({
      status,
      response,
      practiceAccountId,
    }: {
      status: string;
      response: IUserPracticeTypeResponse | null;
      practiceAccountId: string | null;
    }) => {
      if (status === 'success') {
        dispatch(
          setAccountDetail({
            userId: response?.userId as string,
            has2fa: response?.has2fa as boolean,
            practiceAccountId: practiceAccountId as string,
          })
        );
        if (response?.has2fa) {
          navigate(TWO_FACTOR_AUTH_ROUTE);
        } else {
          const payload = {
            loginId: response?.loginId,
            emailId: response?.emailId,
            practiceAccountId,
            userId: response?.userId,
          } as IPracticeAccountTypePayload;
          authCompletion(payload, onAuthComplete);
        }
      }
    },
    []
  );

  const onComplete = useCallback(({ status, response }: { status: string; response: ILoginResponse | null }) => {
    if (status === 'success') {
      // Navigate to the select practice type page if there are multiple practice accounts
      if ((response as ILoginResponse)?.practiceAccountList?.length > 1) {
        console.log('More than one practice account found. Redirecting to select practice type page...');
        navigate(SELECT_PRACTICE_TYPE_ROUTE);
      }
      // Programatically  select practice Account if there is only one practice account in the List
      if ((response as ILoginResponse)?.practiceAccountList?.length === 1) {
        console.log('Only one practice Account');
        const mapToPayload = {
          loginId: response?.loginId,
          emailId: response?.emailId,
          practiceAccountId: response?.practiceAccountList?.[0].id,
        } as IPracticeAccountTypePayload;

        selectUserPracticeAccount(mapToPayload, onPracticeSelectionComplete);
      }
    }
  }, []);

  const handleSubmit = (values: LoginDetails) => {
    const payload = {
      emailId: values.email,
      password: values.password,
    };
    postUserLogin(payload, onComplete);
  };

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='bg-white rounded-md w-full my-6 sm:my-11 max-w-[550px] p-5 sm:p-7 sm:pb-10 shadow-none sm:shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]'>
        <div className='w-full'>
          <div className='w-full flex justify-center items-center text-center border-b-[3px] border-[#005399]'>
            <h2 className='text-xl sm:text-2xl text-[#255294] font-medium mb-6'>Account Login</h2>
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
                    label='Email'
                    name='email'
                    value={values.email}
                    placeholder='Enter your email Address'
                    required
                    onChange={handleChange}
                    onClear={handleClear}
                    type='email'
                    errorMessage={touched.email && errors.email ? errors.email : ''}
                  />

                  <TextField
                    label='Password'
                    name='password'
                    value={values.password}
                    placeholder='Enter your password'
                    required
                    onChange={handleChange}
                    // onClear={handleClear}
                    showPasswordToggle
                    type='password'
                    errorMessage={touched.password && errors.password ? errors.password : ''}
                  />

                  <div className='flex justify-center items-center gap-5 w-full pt-6'>
                    <button
                      type='submit'
                      disabled={!allFieldsFilled || isLoginLoading}
                      className='bg-[#009BDF] text-lg font-medium text-white w-28 h-11 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                    >
                      {isLoginLoading ? <ButtonLoader size={20} /> : 'Login'}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <div className='w-full mt-14 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-xs'>
            <Link
              to='/forgot-password'
              className='underline font-medium text-[#009BDF]'
            >
              Forgot Password
            </Link>
            <span className='text-[#D6DBDE] font-semibold'>|</span>
            <Link
              to='/welcome'
              className='underline font-medium text-[#009BDF]'
            >
              Create Account
            </Link>
            <span className='text-[#D6DBDE] font-semibold'>|</span>
            <Link
              to='/welcome'
              className='underline font-medium text-[#009BDF]'
            >
              Reactivate Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
