import { Dropdown } from '@/lib/ui/components/drop-down';
import { ButtonLoader } from '@/lib/ui/components/loader';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { useUserLogin } from '@/lumifi/hooks';
import { TWO_FACTOR_AUTH_ROUTE } from '@/lumifi/routes';
import type { IPracticeAccountTypePayload, IUserPracticeTypeResponse, IUserResponse } from '@/lumifi/types';
import { clearLoginData, setAccountDetail } from '@/store/slices';
import type { RootState } from '@/store/store';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  practiceTypeId: Yup.string().required(t('lumifi', 'practiceTypes.errors.required')),
});

export const SelectPracticeType: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginId, emailId, userPracticeExistance } = useSelector((state: RootState) => state.loginAuth);
  const { isSelectPracticeLoading, selectUserPracticeAccount } = useUserLogin();
  const { isAuthCompletionLoading, authCompletion } = useUserLogin();

  const initialValues = {
    practiceTypeId: '',
  };

  const practiceTypeOptions = useMemo((): { label: string; value: string }[] => {
    if (userPracticeExistance?.length) {
      const mapped = userPracticeExistance.map((item) => ({
        label: item.practice_name,
        value: item.id,
      }));
      return mapped as { label: string; value: string }[];
    }
    return [];
  }, [userPracticeExistance]);

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

  const onComplete = useCallback(
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
            loginId,
            emailId,
            practiceAccountId,
            userId: response?.userId as string,
          } as IPracticeAccountTypePayload;
          authCompletion(payload, onAuthComplete);
        }
      }
    },
    []
  );

  const handleSubmit = (values: { practiceTypeId: string }) => {
    const payload = {
      loginId,
      emailId,
      practiceAccountId: values.practiceTypeId,
    };
    selectUserPracticeAccount(payload, onComplete);
  };

  const handleCancel = () => {
    dispatch(clearLoginData());
    navigate('/login');
  };

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='bg-white rounded-md w-full my-6 sm:my-11 max-w-[550px] p-5 sm:p-7 sm:pb-10 shadow-none sm:shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]'>
        <div className='w-full'>
          <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
            <H2 className='text-xl sm:text-2xl text-[#255294] font-medium mb-2'>
              {t('lumifi', 'selectPracticeType.title')}
            </H2>
            <H4 className='text-[#7F7F7F] text-sm sm:text-lg leading-[22px] font-medium mb-6 break-words whitespace-pre-wrap'>
              {t('lumifi', 'selectPracticeType.subtitle')}
            </H4>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnMount
          >
            {({ values, setFieldValue, errors, touched }) => {
              const allFieldsFilled = values.practiceTypeId.trim() !== '';

              return (
                <Form className='space-y-5 mt-10'>
                  <div>
                    <label
                      htmlFor='practiceTypeId'
                      className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                    >
                      Practice Type
                    </label>
                    <Dropdown
                      options={practiceTypeOptions}
                      selectedOption={
                        practiceTypeOptions.find((option) => option.value === values.practiceTypeId) || null
                      }
                      onSelect={(selectedOption) => {
                        setFieldValue('practiceTypeId', selectedOption.value);
                      }}
                      placeholder={t('lumifi', 'usersInfo.role.placeholder')}
                    />
                    {touched.practiceTypeId && errors.practiceTypeId && (
                      <p className='text-[11px] text-[#DB5656] font-medium'>{errors.practiceTypeId}</p>
                    )}
                  </div>

                  <div className='flex justify-center items-center gap-5 w-full pt-6'>
                    <button
                      onClick={handleCancel}
                      type='button'
                      className='flex justify-center items-center gap-1 text-[#009BDF] text-lg font-medium w-28 h-11 focus:outline-none cursor-pointer'
                    >
                      <span>{t('lumifi', 'common.cancel')}</span>
                    </button>
                    <button
                      type='submit'
                      disabled={!allFieldsFilled}
                      className='flex justify-center items-center gap-1 bg-[#009BDF] text-lg font-medium text-white w-28 h-11 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                    >
                      {isSelectPracticeLoading || isAuthCompletionLoading ? (
                        <ButtonLoader size={20} />
                      ) : (
                        <span>{t('lumifi', 'common.letsGo')}</span>
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
