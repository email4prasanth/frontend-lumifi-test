import { arrowRightIcon, closeIcon, infoIcon } from '@/assets/images';
import { Autocomplete } from '@/lib/ui/components/auto-complete';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { TextField } from '@/lib/ui/components/text-field';
import { t, validateDEANumber } from '@/lib/utils';
import { useManageDoctor } from '@/lumifi/hooks';
import { Form, Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Header } from '../Header';

const validationSchema = Yup.object({
  firstName: Yup.string().required(t('lumifi', 'doctorInfo.errors.firstName.required')),
  lastName: Yup.string().required(t('lumifi', 'doctorInfo.errors.lastName.required')),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('lumifi', 'doctorInfo.errors.email.invalid'))
    .required(t('lumifi', 'doctorInfo.errors.email.required')),
  deaNumber: Yup.string().when('hasNoDea', {
    is: false,
    then: (schema) =>
      schema
        .required(t('lumifi', 'doctorInfo.errors.deaNumber.required'))
        .test('valid-dea', t('lumifi', 'doctorInfo.errors.deaNumber.invalid'), function (value) {
          const { lastName } = this.parent;
          return validateDEANumber(value, lastName);
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  licenseNumber: Yup.string().when('hasNoDea', {
    is: true,
    then: (schema) => schema.required(t('lumifi', 'doctorInfo.errors.licenseNumber.required')),
    otherwise: (schema) => schema.notRequired(),
  }),
  licenseState: Yup.string().when('hasNoDea', {
    is: true,
    then: (schema) => schema.required(t('lumifi', 'doctorInfo.errors.licenseState.required')),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const ManageDoctorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditEnabled = Boolean(id);
  const {
    isDoctorDependenciesLoading,
    availableStatesForDoctor,
    doctorRole,
    fetchDoctorDependencies,
    isDoctorCreating,
    createDoctor,
    isDoctorUpdating,
    updateDoctor,
    isDoctorFetching,
    doctorDetails,
    fetchDoctorDetails,
  } = useManageDoctor();

  useEffect(() => {
    fetchDoctorDependencies();
    if (id) {
      fetchDoctorDetails(id);
    }
  }, [id]);

  const initialValues = useMemo(() => {
    // If id is not present, Considered as Add Doctor
    if (!id || !doctorDetails) {
      return {
        firstName: '',
        lastName: '',
        email: '',
        deaNumber: '',
        hasNoDea: false,
        licenseNumber: '',
        licenseState: '',
      };
    }
    // If id is present, Considered as Update Doctor
    return {
      firstName: doctorDetails.first_name,
      lastName: doctorDetails.last_name,
      email: doctorDetails.email_id,
      deaNumber: doctorDetails.dea,
      hasNoDea: !!(!doctorDetails.dea && doctorDetails.license_number),
      licenseNumber: doctorDetails.license_number,
      licenseState: doctorDetails.state_of_issue,
    };
  }, [id, doctorDetails]);

  const mapToCreatePayload = (values: typeof initialValues) => ({
    firstName: values.firstName,
    lastName: values.lastName,
    emailId: values.email,
    has2fa: false,
    // phoneNumber: doctorDetails?.phone_number || '',
    phoneNumber: '',
    roleId: doctorRole?.id as string,
    role: doctorRole?.role_name as string,
    dea: values.deaNumber,
    licenseNumber: values.licenseNumber || '',
    stateOfIssue: values.licenseState || '',
  });

  const mapToUpdatePayload = (id: string, values: typeof initialValues) => ({
    id,
    firstName: values.firstName,
    lastName: values.lastName,
    emailId: values.email,
    has2fa: false,
    phoneNumber: doctorDetails?.phone_number || '',
    roleId: doctorRole?.id as string,
    role: doctorRole?.role_name as string,
    dea: values.deaNumber,
    licenseNumber: values.licenseNumber || '',
    stateOfIssue: values.licenseState || '',
  });

  const stateOptions = useMemo(() => {
    let _stateOptions: { label: string; value: string; id: string }[] = [];
    if (availableStatesForDoctor.length > 0) {
      _stateOptions = availableStatesForDoctor?.map((state) => ({
        label: state.state_name,
        value: state.state_name,
        id: state.id,
      }));
    }
    return _stateOptions;
  }, [availableStatesForDoctor]);

  const onComplete = () => {
    navigate('/settings/doctor/list');
  };

  const handleSubmit = (values: typeof initialValues) => {
    if (isEditEnabled) {
      const payload = mapToUpdatePayload(id as string, values);
      updateDoctor(payload, onComplete);
    } else {
      const payload = mapToCreatePayload(values);
      createDoctor(payload, onComplete);
    }
  };

  return (
    <div className='container mx-auto h-auto'>
      <Header mode={id ? 'edit' : 'add'} />
      {isDoctorDependenciesLoading || isDoctorFetching ? (
        <Loader overlay={false} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnMount
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => {
            const handleClear = (fieldName: string) => setFieldValue(fieldName, '');
            const allFieldsFilled =
              values.firstName.trim() !== '' &&
              values.lastName.trim() !== '' &&
              values.email.trim() !== '' &&
              (values.hasNoDea
                ? values.licenseNumber?.trim() !== '' && values.licenseState?.trim() !== ''
                : values.deaNumber.trim() !== '');

            const handleCheckboxChange = (field: string, value: boolean) => {
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

            return (
              <Form className='pt-2 sm:pt-10 space-y-6 sm:max-w-[540px] mx-auto'>
                <TextField
                  id='first-name'
                  label={t('lumifi', 'doctorInfo.firstName.label')}
                  name='firstName'
                  value={values.firstName}
                  placeholder={t('lumifi', 'doctorInfo.firstName.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.firstName && errors.firstName ? errors.firstName : ''}
                />

                <TextField
                  id='last-name'
                  label={t('lumifi', 'doctorInfo.lastName.label')}
                  name='lastName'
                  value={values.lastName}
                  placeholder={t('lumifi', 'doctorInfo.lastName.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.lastName && errors.lastName ? errors.lastName : ''}
                />

                {/* Edit Mode: Show Doc-Email as read-only */}
                {isEditEnabled ? (
                  <div className='mb-4'>
                    <label className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'>
                      {t('lumifi', 'doctorInfo.email.label')} *
                    </label>
                    <p className='text-base text-[#4E5053]'>{values.email}</p>
                  </div>
                ) : (
                  <TextField
                    id='doctor-email'
                    label={t('lumifi', 'doctorInfo.email.label')}
                    name='email'
                    value={values.email}
                    placeholder={t('lumifi', 'doctorInfo.email.placeholder')}
                    required
                    type='email'
                    onChange={handleChange}
                    onClear={handleClear}
                    errorMessage={touched.email && errors.email ? errors.email : ''}
                  />
                )}

                {/* Edit Mode: Show DEA/License as read-only */}
                {isEditEnabled ? (
                  <>
                    {values.deaNumber ? (
                      <div className='mb-4'>
                        <label className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'>
                          {t('lumifi', 'doctorInfo.deaNumber.label')} *
                        </label>
                        <p className='text-base text-[#4E5053]'>{values.deaNumber}</p>
                      </div>
                    ) : (
                      <>
                        <div className='mb-4'>
                          <label className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'>
                            {t('lumifi', 'doctorInfo.licenseNumber.label')} *
                          </label>
                          <p className='text-base text-[#4E5053]'>{values.licenseNumber}</p>
                        </div>
                        <div className='mb-4'>
                          <label className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'>
                            {t('lumifi', 'doctorInfo.licenseState.label')}
                          </label>
                          <p className='text-base text-[#4E5053]'>{values.licenseState}</p>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // Add Mode: Show editable fields
                  <>
                    {!values.hasNoDea && (
                      <TextField
                        id='dea-number'
                        label={t('lumifi', 'doctorInfo.deaNumber.label')}
                        name='deaNumber'
                        value={values.deaNumber}
                        placeholder={t('lumifi', 'doctorInfo.deaNumber.placeholder')}
                        required={!values.hasNoDea}
                        disabled={values.hasNoDea}
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
                          infoText: t('lumifi', 'doctorInfo.deaNumber.tooltip'),
                        }}
                      />
                    )}

                    {values.deaNumber.length === 0 && (
                      <div className='flex items-center gap-2'>
                        <input
                          data-testid='has-no-dea-checkbox'
                          type='checkbox'
                          id='hasNoDea'
                          name='hasNoDea'
                          checked={values.hasNoDea}
                          onChange={(e) => handleCheckboxChange('hasNoDea', e.target.checked)}
                          className='w-[18px] h-[18px] cursor-pointer accent-[#009BDF] rounded'
                        />
                        <label
                          htmlFor='hasNoDea'
                          className='text-sm font-medium text-[#4E5053] italic'
                        >
                          {t('lumifi', 'doctorInfo.hasNoDeaCheckbox')}
                        </label>
                      </div>
                    )}

                    {values.hasNoDea && (
                      <>
                        <TextField
                          id='license-number'
                          label={t('lumifi', 'doctorInfo.licenseNumber.label')}
                          name='licenseNumber'
                          value={values.licenseNumber || ''}
                          placeholder={t('lumifi', 'doctorInfo.licenseNumber.placeholder')}
                          required
                          onChange={handleChange}
                          onClear={handleClear}
                          errorMessage={touched.licenseNumber && errors.licenseNumber ? errors.licenseNumber : ''}
                        />

                        <div data-testid='state'>
                          <label
                            htmlFor='licenseState'
                            className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                          >
                            {t('lumifi', 'doctorInfo.licenseState.label')}
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
                    data-testid='cancel-button'
                    onClick={() => navigate('/settings/doctor/list')}
                    type='button'
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
                    data-testid='next-button'
                    type='submit'
                    disabled={!allFieldsFilled}
                    className='flex justify-center items-center gap-3 bg-[#009BDF] text-lg font-medium text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                  >
                    {isDoctorCreating || isDoctorUpdating ? (
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
