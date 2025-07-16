import { arrowRightIcon, closeIcon, infoIcon } from '@/assets/images';
import { Autocomplete } from '@/lib/ui/components/auto-complete';
import { Image } from '@/lib/ui/components/image';
import { TextField } from '@/lib/ui/components/text-field';
import { H2, H4 } from '@/lib/ui/components/typography';
import { t, validateDEANumber } from '@/lib/utils';
import type { DoctorInfo, IGetStatesList } from '@/lumifi/types';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface DoctorInfoFormProps {
  onNext: (data: DoctorInfo) => void;
  userStatesList: IGetStatesList[];
}

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

export const DoctorInfoForm = React.memo(({ onNext, userStatesList }: DoctorInfoFormProps) => {
  const navigate = useNavigate();
  const initialValues: DoctorInfo = {
    firstName: '',
    lastName: '',
    email: '',
    deaNumber: '',
    hasNoDea: false,
    licenseNumber: '',
    licenseState: '',
  };

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

  const handleSubmit = (values: DoctorInfo) => {
    onNext(values);
  };

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399]'>
        <H2
          data-testid='doctor-title'
          className='text-xl sm:text-2xl text-[#255294] font-medium mb-2'
        >
          {t('lumifi', 'doctorInfo.title')}
        </H2>
        <H4
          data-testid='doctor-subtitle'
          className='text-[#4B4B4B] text-sm sm:text-lg leading-[21px] font-medium italic mb-6'
        >
          {t('lumifi', 'doctorInfo.message')}
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
            <Form className='space-y-5 mt-10'>
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

              <div className='flex justify-center items-center gap-5 w-full pt-6'>
                <button
                  data-testid='cancel-button'
                  onClick={() => navigate('/login')}
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
    </div>
  );
});
