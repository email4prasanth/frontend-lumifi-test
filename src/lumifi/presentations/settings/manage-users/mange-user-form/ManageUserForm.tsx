import { arrowRightIcon, closeIcon } from '@/assets/images';
import { Dropdown } from '@/lib/ui/components/drop-down';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { PhoneInputField } from '@/lib/ui/components/phone-input';
import { TextField } from '@/lib/ui/components/text-field';
import { t } from '@/lib/utils';
import { useManageUser } from '@/lumifi/hooks';
import { Form, Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Header } from '../Header';

const validationSchema = Yup.object().shape({
  userFirstName: Yup.string()
    .required(t('lumifi', 'usersInfo.errors.firstName.required'))
    .matches(/^[A-Za-z\s]+$/, t('lumifi', 'usersInfo.errors.firstName.invalid')),
  userLastName: Yup.string()
    .required(t('lumifi', 'usersInfo.errors.lastName.required'))
    .matches(/^[A-Za-z\s]+$/, t('lumifi', 'usersInfo.errors.lastName.invalid')),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('lumifi', 'usersInfo.errors.email.invalid'))
    .required(t('lumifi', 'usersInfo.errors.email.required')),
  mobileNumber: Yup.string()
    .test('valid-phone', t('lumifi', 'usersInfo.errors.mobileNumber.invalid'), (value) => {
      if (!value) return true;
      const digits = value.replace(/[^\d+]/g, '');
      if (digits.startsWith('+1')) return digits.length === 12;
      if (digits.startsWith('+44')) return digits.length === 13;
      return false;
    })
    .nullable(),
  role: Yup.string().required(t('lumifi', 'usersInfo.errors.role.required')),
});

export const ManageUserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditEnabled = Boolean(id);
  const {
    isUserCreating,
    isUserUpdating,
    updateUser,
    createUser,
    isUserFetching,
    userDetails,
    fetchUserDetails,
    isUserDependenciesLoading,
    availableRolesForUser,
    fetchUserDependencies,
  } = useManageUser();

  useEffect(() => {
    fetchUserDependencies();
    if (id) {
      fetchUserDetails(id);
    }
  }, [id]);

  // API data to UI options
  const roleOptions = useMemo(() => {
    return availableRolesForUser.map((role) => ({
      label: role.role_name,
      value: role.role_name,
      id: role.id,
    }));
  }, [availableRolesForUser]);

  const initialValues = useMemo(() => {
    // If id is not present, Considered as Add User
    if (!id || !userDetails) {
      return {
        userFirstName: '',
        userLastName: '',
        email: '',
        twoFactorAuthEnabled: false,
        mobileNumber: '',
        role: '',
        roleId: '',
      };
    }
    // If id is present, Considered as Update User
    return {
      userFirstName: userDetails.first_name,
      userLastName: userDetails.last_name,
      email: userDetails.email_id,
      twoFactorAuthEnabled: userDetails.has_2fa,
      mobileNumber: userDetails.phone_number,
      role: userDetails.role,
      roleId: userDetails.role_id,
    };
  }, [id, userDetails]);

  const mapToCreatePayload = (values: typeof initialValues) => ({
    firstName: values.userFirstName,
    lastName: values.userLastName,
    emailId: values.email,
    has2fa: values.twoFactorAuthEnabled,
    phoneNumber: values.mobileNumber,
    roleId: values.roleId,
    role: values.role,
    dea: '',
    licenseNumber: '',
    stateOfIssue: '',
  });

  const mapToUpdatePayload = (id: string, values: typeof initialValues) => ({
    id,
    firstName: values.userFirstName,
    lastName: values.userLastName,
    emailId: values.email,
    has2fa: values.twoFactorAuthEnabled,
    phoneNumber: values.mobileNumber,
    roleId: values.roleId,
    role: values.role,
    dea: '',
    licenseNumber: '',
    stateOfIssue: '',
  });

  const onComplete = () => {
    navigate('/settings/user/list');
  };

  const handleSubmit = (values: typeof initialValues) => {
    if (isEditEnabled) {
      const payload = mapToUpdatePayload(id as string, values);
      updateUser(payload, onComplete);
    } else {
      const payload = mapToCreatePayload(values);
      createUser(payload, onComplete);
    }
  };

  return (
    <div className='container mx-auto h-auto'>
      <Header mode={id ? 'edit' : 'add'} />
      {isUserDependenciesLoading || isUserFetching ? (
        <Loader overlay={false} />
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => {
            const handleClear = (fieldName: string) => setFieldValue(fieldName, '');
            const requiredFieldsFilled = ['userFirstName', 'userLastName', 'email', 'role'].every(
              (field) => values[field as keyof typeof initialValues]?.toString().trim() !== ''
            );

            return (
              <Form className='pt-2 sm:pt-10 space-y-6 sm:max-w-[540px] mx-auto'>
                <TextField
                  label={t('lumifi', 'usersInfo.userFirstName.label')}
                  name='userFirstName'
                  value={values.userFirstName}
                  placeholder={t('lumifi', 'usersInfo.userFirstName.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.userFirstName && errors.userFirstName ? errors.userFirstName : ''}
                />

                <TextField
                  label={t('lumifi', 'usersInfo.userLastName.label')}
                  name='userLastName'
                  value={values.userLastName}
                  placeholder={t('lumifi', 'usersInfo.userLastName.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.userLastName && errors.userLastName ? errors.userLastName : ''}
                />

                {/* Edit Mode: Show User-Email as read-only */}
                {isEditEnabled ? (
                  <div className='mb-4'>
                    <label className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'>
                      {t('lumifi', 'usersInfo.email.label')} *
                    </label>
                    <p className='text-base text-[#4E5053]'>{values.email}</p>
                  </div>
                ) : (
                  <TextField
                    label={t('lumifi', 'usersInfo.email.label')}
                    name='email'
                    value={values.email}
                    placeholder={t('lumifi', 'usersInfo.email.placeholder')}
                    required
                    onChange={handleChange}
                    onClear={handleClear}
                    type='email'
                    errorMessage={touched.email && errors.email ? errors.email : ''}
                  />
                )}

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

                {/* Edit Mode: Show User-mobileNumber as read-only */}
                {isEditEnabled ? (
                  <div className='mb-4'>
                    <label className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'>
                      {t('lumifi', 'usersInfo.mobileNumber.label')}
                    </label>
                    <p className='text-base text-[#4E5053]'>{values.mobileNumber || 'N/A'}</p>
                  </div>
                ) : (
                  <PhoneInputField
                    label={t('lumifi', 'usersInfo.mobileNumber.label')}
                    name='mobileNumber'
                    value={values.mobileNumber || ''}
                    placeholder={t('lumifi', 'usersInfo.mobileNumber.placeholder')}
                    onChange={(phone) => setFieldValue('mobileNumber', phone.startsWith('+') ? phone : `+${phone}`)}
                    onClear={handleClear}
                    errorMessage={touched.mobileNumber && errors.mobileNumber ? errors.mobileNumber : ''}
                  />
                )}

                <div>
                  <label
                    htmlFor='role'
                    className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                  >
                    {t('lumifi', 'usersInfo.role.label')}
                  </label>
                  <Dropdown
                    options={roleOptions}
                    selectedOption={roleOptions.find((option) => option.value === values.role) || null}
                    onSelect={(selectedOption) => {
                      setFieldValue('role', selectedOption.value);
                      setFieldValue('roleId', selectedOption.id);
                    }}
                    placeholder={t('lumifi', 'usersInfo.role.placeholder')}
                  />
                  {touched.role && errors.role && (
                    <p className='text-[11px] text-[#DB5656] font-medium'>{errors.role}</p>
                  )}
                </div>

                <div className='flex justify-center items-center gap-5 w-full pt-10'>
                  <button
                    type='button'
                    onClick={() => navigate('/settings/user/list')}
                    className='flex justify-center items-center gap-1 text-[#009BDF] text-lg font-medium w-28 h-10 focus:outline-none'
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
                    disabled={!requiredFieldsFilled}
                    className='flex justify-center items-center gap-3 bg-[#009BDF] text-lg font-medium text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                  >
                    {isUserCreating || isUserUpdating ? (
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
