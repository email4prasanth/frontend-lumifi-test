import {
  arrowRightIcon,
  circleXIcon,
  closeIcon,
  dentalImage,
  editIcon,
  infoIcon,
  plusIcon,
  skipArrowIcon,
  tickIcon,
} from '@/assets/images';
import { Autocomplete } from '@/lib/ui/components/auto-complete';
import { Dropdown } from '@/lib/ui/components/drop-down';
import { Image } from '@/lib/ui/components/image';
import { PhoneInputField } from '@/lib/ui/components/phone-input';
import { TextField } from '@/lib/ui/components/text-field';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t, validateDEANumber } from '@/lib/utils';
import type { IGetStatesList, IGetUserRole, UserDocInfo, UsersInfo } from '@/lumifi/types';
import { Form, Formik } from 'formik';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface AddUsersInfoFormProps {
  onNext: (data: { users: UsersInfo[] }) => void;
  onSkip: () => void;
  userStatesList: IGetStatesList[];
  userRolesList: IGetUserRole[];
}

export const AddUsersInfo = React.memo(({ onNext, onSkip, userStatesList, userRolesList }: AddUsersInfoFormProps) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [users, setUsers] = useState<UsersInfo[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      userFirstName: Yup.string()
        .required(t('lumifi', 'usersInfo.errors.firstName.required'))
        .matches(/^[A-Za-z\s]+$/, t('lumifi', 'usersInfo.errors.firstName.invalid')),
      userLastName: Yup.string()
        .required(t('lumifi', 'usersInfo.errors.lastName.required'))
        .matches(/^[A-Za-z\s]+$/, t('lumifi', 'usersInfo.errors.lastName.invalid')),
      email: Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('lumifi', 'usersInfo.errors.email.invalid'))
        .required(t('lumifi', 'usersInfo.errors.email.required'))
        // Add email uniqueness validation
        .test('unique-email', t('lumifi', 'usersInfo.email.duplicate'), function (value) {
          if (!value) return true;
          const normalizedEmail = value.toLowerCase().trim();
          // Check if email exists in users array
          const emailExists = users.some((user) => {
            // Skip checking against the user being edited
            if (editingUserId && user.id === editingUserId) return false;
            return user.email.toLowerCase().trim() === normalizedEmail;
          });
          return !emailExists;
        }),
      mobileNumber: Yup.string()
        .test('valid-phone', t('lumifi', 'usersInfo.errors.mobileNumber.invalid'), (value) => {
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
      role: Yup.string().required(t('lumifi', 'usersInfo.errors.role.required')),
      deaNumber: Yup.string().when(['role', 'hasNoDea'], {
        is: (role: string, hasNoDea: boolean) => role === 'Doctor' && !hasNoDea,
        then: (schema) =>
          schema
            .required(t('lumifi', 'usersInfo.errors.deaNumber.required'))
            .test('valid-dea', t('lumifi', 'usersInfo.errors.deaNumber.invalid'), function (value) {
              const { userLastName } = this.parent;
              return validateDEANumber(value, userLastName);
            }),
        otherwise: (schema) => schema.notRequired(),
      }),
      licenseNumber: Yup.string().when(['role', 'hasNoDea'], {
        is: (role: string, hasNoDea: boolean) => role === 'Doctor' && hasNoDea,
        then: (schema) => schema.required(t('lumifi', 'usersInfo.errors.licenseNumber.required')),
        otherwise: (schema) => schema.notRequired(),
      }),
      licenseState: Yup.string().when(['role', 'hasNoDea'], {
        is: (role: string, hasNoDea: boolean) => role === 'Doctor' && hasNoDea,
        then: (schema) => schema.required(t('lumifi', 'usersInfo.errors.licenseState.required')),
        otherwise: (schema) => schema.notRequired(),
      }),
    });
  }, [users, editingUserId]);

  const stateOptions = useMemo(() => {
    let _stateOptions: { label: string; value: string; id: string }[] = [];
    if (userStatesList.length > 0) {
      _stateOptions = userStatesList?.map((state) => ({
        label: state.state_name,
        value: state.state_name,
        id: state.id,
      }));
    }
    return _stateOptions;
  }, [userStatesList]);

  const roleOptions = useMemo(() => {
    let _roleOptions: { label: string; value: string; id: string }[] = [];
    if (userRolesList.length > 0) {
      _roleOptions = userRolesList
        ?.filter((item) => item?.role_name !== 'Account Owner')
        ?.map((role) => ({
          label: role.role_name,
          value: role.role_name,
          id: role.id,
        }));
    }
    return _roleOptions;
  }, [userRolesList]);

  const initialValues: UsersInfo & {
    deaNumber: string;
    hasNoDea: boolean;
    licenseNumber?: string;
    licenseState?: string;
  } = {
    userFirstName: '',
    userLastName: '',
    email: '',
    twoFactorAuthEnabled: false,
    mobileNumber: '',
    role: '',
    roleId: '',
    deaNumber: '',
    hasNoDea: false,
    licenseNumber: '',
    licenseState: '',
  };

  const handleSaveUsers = (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
    const userData: UsersInfo = {
      id: editingUserId || Date.now().toString(), // Use existing ID if editing
      userFirstName: values.userFirstName,
      userLastName: values.userLastName,
      email: values.email,
      twoFactorAuthEnabled: values.twoFactorAuthEnabled,
      mobileNumber: values.mobileNumber,
      role: values.role,
      roleId: values.roleId,
    };

    if (values.role === 'Doctor') {
      const docInfo: UserDocInfo = {
        deaNumber: values.hasNoDea ? '' : values.deaNumber,
        hasNoDea: values.hasNoDea,
        licenseNumber: values.hasNoDea ? values.licenseNumber || '' : '',
        licenseState: values.hasNoDea ? values.licenseState || '' : '',
      };
      userData.docInfo = docInfo;
    }

    if (editingUserId) {
      // Update existing user
      setUsers(users.map((u) => (u.id === editingUserId ? userData : u)));
    } else {
      // Add new user
      setUsers([...users, userData]);
    }

    resetForm();
    setShowForm(false);
    setEditingUserId(null); // Reset editing state
  };

  const handleEditUser = (user: UsersInfo) => {
    setEditingUserId(user.id as string);

    // Pre-fill form values
    const formValues = {
      ...user,
      deaNumber: user.role === 'Doctor' ? user.docInfo?.deaNumber || '' : '',
      hasNoDea: user.role === 'Doctor' ? user.docInfo?.hasNoDea || false : false,
      licenseNumber: user.role === 'Doctor' && user.docInfo?.hasNoDea ? user.docInfo.licenseNumber || '' : '',
      licenseState: user.role === 'Doctor' && user.docInfo?.hasNoDea ? user.docInfo.licenseState || '' : '',
    };

    setInitialFormValues(formValues);
    setShowForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    toast.success('User Deleted!');
  };

  const [initialFormValues, setInitialFormValues] = useState(initialValues);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCheckboxChange = (setFieldValue: any, field: string, value: boolean) => {
    setFieldValue(field, value);
    if (field === 'hasNoDea') {
      if (value === true) {
        setFieldValue('deaNumber', '');
      } else {
        setFieldValue('licenseNumber', '');
        setFieldValue('licenseState', '');
      }
    }
  };

  const handleSubmit = () => {
    if (users.length > 0) {
      const usersInfo = { users };
      onNext(usersInfo);
    } else {
      onSkip();
    }
  };

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
        <H2
          data-testid='userInfo-title'
          className='text-xl sm:text-2xl text-[#255294] font-medium mb-2'
        >
          {t('lumifi', 'usersInfo.title')}
        </H2>
        {users.length > 0 ? (
          <H4
            data-testid='userInfo-subtitle'
            className='text-[#4B4B4B] text-sm sm:text-lg leading-[21px] font-medium italic mb-6'
          >
            {t('lumifi', 'usersInfo.successMessageLine1')}
            <br />
            {t('lumifi', 'usersInfo.successMessageLine2')}
          </H4>
        ) : (
          <H4
            data-testid='userInfo-intialmsg'
            className='text-[#4B4B4B] text-sm sm:text-lg leading-[21px] font-medium italic mb-6'
          >
            {t('lumifi', 'usersInfo.initialMessage')}
          </H4>
        )}
      </div>
      {!showForm ? (
        <div className='flex flex-col justify-center items-center gap-5 mt-10 mb-3'>
          {users.length > 0 ? (
            // User list container
            <div className='w-full max-w-md mx-auto max-h-96 overflow-y-auto mb-6'>
              <div className='space-y-3 px-4'>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className='bg-[#F1F1F1] px-4 h-12 rounded-[4px] flex items-center justify-between'
                  >
                    <div className='flex items-center justify-start gap-2'>
                      <Image
                        src={tickIcon}
                        alt='Saved'
                        className='w-5 h-5'
                      />
                      <span className='text-black text-lg font-medium capitalize'>
                        {user.role === 'Doctor' ? 'Dr. ' : ''}
                        {user.userFirstName} {user.userLastName}
                      </span>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={() => handleEditUser(user)}
                        className='flex justify-center items-center gap-2 text-lg font-medium cursor-pointer text-[#009BDF] focus:outline-none'
                      >
                        <Image
                          src={editIcon}
                          alt='Edit'
                          className='w-5 h-4'
                        />
                      </button>
                      <button
                        data-testid='cancel-button'
                        type='button'
                        onClick={() => handleDeleteUser(user.id as string)}
                        className='flex justify-center items-center gap-2 text-lg font-medium cursor-pointer text-red-500 focus:outline-none'
                      >
                        <Image
                          src={circleXIcon}
                          alt='Delete'
                          className='w-5 h-5'
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='w-80 h-72'>
              <Image
                src={dentalImage}
                alt='FooterLogo'
                className='w-full h-full'
              />
            </div>
          )}
          <div className='flex justify-center items-center gap-5 w-full pt-6'>
            <button
              data-testid='add-users-button'
              onClick={() => setShowForm(true)}
              type='button'
              className='flex justify-center items-center gap-3 text-lg font-medium bg-[#009BDF] text-white w-40 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed cursor-pointer'
            >
              <Image
                src={plusIcon}
                alt='arrow-right'
                className='w-4 h-4'
              />
              <span>{t('lumifi', 'common.addUser')}</span>
            </button>
          </div>
          <div className='flex justify-center items-center gap-10 w-full pt-6'>
            <button
              data-testid='main-cancel-button'
              onClick={() => navigate('/login')}
              type='button'
              className='flex justify-center items-center gap-1 text-[#009BDF] text-lg cursor-pointer font-medium w-28 h-10 focus:outline-none'
            >
              <Image
                src={closeIcon}
                alt='close-icon'
                className='w-5 h-3'
              />
              <span>{t('lumifi', 'common.cancel')}</span>
            </button>
            <button
              data-testid='main-next-button'
              onClick={handleSubmit}
              type='button'
              className='flex justify-center items-center gap-2 text-[#009BDF] text-lg font-medium  h-10 cursor-pointer focus:outline-none hover:underline'
            >
              <span>
                {users.length > 0 ? t('lumifi', 'usersInfo.userAdded') : t('lumifi', 'usersInfo.userNotAdded')}
              </span>
              <Image
                src={skipArrowIcon}
                alt='arrow-right'
                className='w-2 h-3'
              />
            </button>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={editingUserId ? initialFormValues : initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSaveUsers}
          validateOnMount
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => {
            const handleClear = (fieldName: string) => setFieldValue(fieldName, '');
            const requiredFieldsFilled = ['userFirstName', 'userLastName', 'email', 'role'].every((field) => {
              const value = values[field as keyof typeof initialValues];
              return typeof value === 'string' && value.trim() !== '';
            });

            const isDoctor = values.role === 'Doctor';
            const showDEAFields = isDoctor && !values.hasNoDea;
            const showLicenseFields = isDoctor && values.hasNoDea;

            return (
              <Form className='space-y-5 mt-10 px-4'>
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

                <PhoneInputField
                  label={t('lumifi', 'usersInfo.mobileNumber.label')}
                  name='mobileNumber'
                  value={values.mobileNumber || ''}
                  placeholder={t('lumifi', 'usersInfo.mobileNumber.placeholder')}
                  onChange={(phone) => {
                    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                    setFieldValue('mobileNumber', formattedPhone);
                  }}
                  onClear={handleClear}
                  // helperText={t('lumifi', 'usersInfo.mobileNumber.helperText')}
                  errorMessage={touched.mobileNumber && errors.mobileNumber ? errors.mobileNumber : ''}
                />
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

                {isDoctor && (
                  <>
                    {showDEAFields && (
                      <TextField
                        label={t('lumifi', 'usersInfo.deaNumber.label')}
                        name='deaNumber'
                        value={values.deaNumber}
                        placeholder={t('lumifi', 'usersInfo.deaNumber.placeholder')}
                        required={isDoctor && !values.hasNoDea}
                        onChange={handleChange}
                        onClear={handleClear}
                        errorMessage={touched.deaNumber && errors.deaNumber ? errors.deaNumber : ''}
                        infoValues={{
                          infoIcon: (
                            <Image
                              src={infoIcon}
                              alt='info-icon'
                              className='w-5 h-5'
                            />
                          ),
                          infoText: t('lumifi', 'usersInfo.deaNumber.infoText'),
                        }}
                      />
                    )}

                    {values.deaNumber.length === 0 && isDoctor && (
                      <div className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          id='hasNoDea'
                          name='hasNoDea'
                          checked={values.hasNoDea}
                          onChange={(e) => handleCheckboxChange(setFieldValue, 'hasNoDea', e.target.checked)}
                          className='w-[18px] h-[18px] cursor-pointer accent-[#009BDF] rounded'
                        />
                        <label
                          htmlFor='hasNoDea'
                          className='text-sm font-medium text-[#4E5053] italic'
                        >
                          {t('lumifi', 'usersInfo.hasNoDea.label')}
                        </label>
                      </div>
                    )}

                    {showLicenseFields && (
                      <>
                        <TextField
                          label={t('lumifi', 'usersInfo.licenseNumber.label')}
                          name='licenseNumber'
                          value={values.licenseNumber || ''}
                          placeholder={t('lumifi', 'usersInfo.licenseNumber.placeholder')}
                          required
                          onChange={handleChange}
                          onClear={handleClear}
                          errorMessage={touched.licenseNumber && errors.licenseNumber ? errors.licenseNumber : ''}
                        />

                        <div>
                          <label
                            htmlFor='licenseState'
                            className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                          >
                            {t('lumifi', 'usersInfo.licenseState.label')}
                          </label>
                          <Autocomplete
                            options={stateOptions}
                            selectedOption={stateOptions.find((option) => option.value === values.licenseState) || null}
                            onSelect={(selectedOption) => setFieldValue('licenseState', selectedOption.value)}
                            placeholder={t('lumifi', 'practiceInfo.state.placeholder')}
                          />
                          {touched.licenseState && errors.licenseState && (
                            <p className='text-[11px] text-[#DB5656] font-medium'>{errors.licenseState}</p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className='flex justify-center items-center gap-5 w-full pt-6'>
                  <button
                    type='button'
                    onClick={() => setShowForm(false)}
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
                    <span>{t('lumifi', 'common.next')}</span>
                    <Image
                      src={arrowRightIcon}
                      alt='arrow-right'
                      className='w-2 h-3'
                    />
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
});
