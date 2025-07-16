import { arrowRightIcon, closeIcon, pencilIcon, tickSaveIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader } from '@/lib/ui/components/loader';
import { PhoneInputField } from '@/lib/ui/components/phone-input';
import { TextField } from '@/lib/ui/components/text-field';
import { t } from '@/lib/utils';
import { usePatient } from '@/lumifi/hooks';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface AddPatientInfo {
  firstName: string;
  lastName: string;
  dob: string;
  email?: string;
  phone?: string;
}

const initialValues: AddPatientInfo = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  phone: '',
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required(t('lumifi', 'patients.addPatient.errors.firstName.required'))
    .matches(/^[A-Za-z\s]+$/, t('lumifi', 'patients.addPatient.errors.firstName.invalid')),
  lastName: Yup.string()
    .required(t('lumifi', 'patients.addPatient.errors.lastName.required'))
    .matches(/^[A-Za-z\s]+$/, t('lumifi', 'patients.addPatient.errors.lastName.invalid')),
  dob: Yup.string()
    .required(t('lumifi', 'patients.addPatient.errors.dob.required'))
    .matches(/^\d{2}-\d{2}-\d{4}$/, 'Date must be in MM-DD-YYYY format and numeric only')
    .test('valid-format', t('lumifi', 'patients.addPatient.errors.dob.format'), (value) =>
      dayjs(value, 'MM-DD-YYYY', true).isValid()
    )
    .test('not-future', t('lumifi', 'patients.addPatient.errors.dob.future'), (value) => {
      if (!value) return false;
      const date = dayjs(value, 'MM-DD-YYYY', true);
      return date.isValid() && date.isBefore(dayjs());
    }),
  email: Yup.string()
    .nullable()
    .notRequired()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      t('lumifi', 'patients.addPatient.errors.email.invalid')
    ),
  phone: Yup.string()
    .test('valid-phone', t('lumifi', 'loginInfo.errors.mobileNumber.invalid'), (value) => {
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
});

export const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState<AddPatientInfo>(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isPatientCreating, createPatient } = usePatient();

  const handleSubmit = (values: AddPatientInfo) => {
    setPatientDetails(values);
    setIsSubmitted(true);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  console.log('Patient Details: ', patientDetails);

  const mapToCreatePayload = () => ({
    firstName: patientDetails.firstName,
    lastName: patientDetails.lastName,
    dob: dayjs(patientDetails.dob, 'MM-DD-YYYY', true).isValid()
      ? dayjs(patientDetails.dob, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
      : '',
    emailId: patientDetails.email || '',
    phoneNumber: patientDetails.phone || '',
  });

  const onComplete = () => {
    navigate('/patients');
  };

  const handleSave = () => {
    createPatient(mapToCreatePayload(), onComplete);
  };

  const handleCancel = () => {
    navigate('/patients');
    setPatientDetails(initialValues);
    setIsSubmitted(false);
  };

  const requiredFields: (keyof AddPatientInfo)[] = ['firstName', 'lastName', 'dob'];

  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='w-full flex flex-col items-center justify-center border-t-2 border-[#009BDF]'>
          <div className='bg-white rounded-md w-full my-6 sm:my-28 max-w-xl p-5 sm:p-7 sm:pb-12 shadow-none sm:shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]'>
            <div className='w-full'>
              <div className='w-full text-center border-b-[3px] border-[#005399] pb-8'>
                <h2 className='text-xl sm:text-2xl text-[#4E5053] font-medium'>
                  {t('lumifi', 'patients.addPatient.title')}
                </h2>
                <p className={`text-[#4E5053] text-lg font-medium ${isSubmitted ? 'block' : 'hidden'}`}>
                  {t('lumifi', 'patients.addPatient.reviewPrompt')}
                </p>
              </div>

              {isSubmitted ? (
                <div className='space-y-5 mt-10'>
                  <div className='grid grid-cols-2 md:grid-cols-[35%_60%] gap-x-[5%] gap-y-3 pb-9 border-b border-[#D6DBDE]'>
                    <div className='text-right tracking-widest text-sm font-semibold text-[#4E5053] uppercase'>
                      {t('lumifi', 'patients.addPatient.labels.firstName')} :
                    </div>
                    <div className='text-[#4E5053] text-base font-medium break-words whitespace-pre-wrap'>
                      {patientDetails.firstName || 'N/A'}
                    </div>

                    <div className='tracking-widest text-right text-sm font-semibold text-[#4E5053] uppercase'>
                      {t('lumifi', 'patients.addPatient.labels.lastName')} :
                    </div>
                    <div className='text-[#4E5053] text-base font-medium break-words whitespace-pre-wrap'>
                      {patientDetails.lastName || 'N/A'}
                    </div>

                    <div className='tracking-widest text-right text-sm font-semibold text-[#4E5053] uppercase'>
                      {t('lumifi', 'patients.addPatient.labels.dob')} :
                    </div>
                    <div className='text-[#4E5053] text-base font-medium break-words whitespace-pre-wrap'>
                      {patientDetails.dob || 'N/A'}
                    </div>

                    <div className='tracking-widest text-right text-sm font-semibold text-[#4E5053] uppercase'>
                      {t('lumifi', 'patients.addPatient.labels.email')} :
                    </div>
                    <div className='text-[#4E5053] text-base font-medium break-words whitespace-pre-wrap'>
                      {patientDetails.email || 'N/A'}
                    </div>

                    <div className='tracking-widest text-right text-sm font-semibold text-[#4E5053] uppercase'>
                      {t('lumifi', 'patients.addPatient.labels.phone')} :
                    </div>
                    <div className='text-[#4E5053] text-base font-medium break-words whitespace-pre-wrap'>
                      {patientDetails.phone || 'N/A'}
                    </div>
                  </div>
                  <div className={`flex justify-center items-center gap-5 pt-6`}>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='flex justify-center items-center text-lg font-medium gap-1 text-[#009BDF] w-28 h-11 focus:outline-none'
                    >
                      <Image
                        src={pencilIcon}
                        alt='pencil-icon'
                        className='w-4 h-4'
                      />{' '}
                      <span>{t('lumifi', 'common.edit')}</span>
                    </button>
                    <button
                      type='button'
                      onClick={handleSave}
                      className='flex justify-center items-center gap-3 text-lg font-medium bg-[#009BDF] text-white w-28 h-11 rounded-[4px] focus:outline-none'
                    >
                      {isPatientCreating ? (
                        <ButtonLoader size={20} />
                      ) : (
                        <>
                          <Image
                            src={tickSaveIcon}
                            alt='arrow-right'
                            className='w-4 h-3'
                          />
                          <span>{t('lumifi', 'common.save')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <Formik
                  initialValues={patientDetails}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  validateOnMount
                >
                  {({ values, handleChange, setFieldValue, errors, touched }) => {
                    const handleClear = (fieldName: string) => setFieldValue(fieldName, '');
                    const allFieldsFilled = requiredFields.every((field) => values[field]?.trim() !== '');
                    return (
                      <Form className='space-y-5 mt-10'>
                        <TextField
                          label={t('lumifi', 'patients.addPatient.labels.firstName')}
                          name='firstName'
                          value={values.firstName}
                          placeholder={t('lumifi', 'patients.addPatient.placeholders.firstName')}
                          required
                          onChange={handleChange}
                          onClear={handleClear}
                          errorMessage={touched.firstName && errors.firstName ? errors.firstName : ''}
                        />

                        <TextField
                          label={t('lumifi', 'patients.addPatient.labels.lastName')}
                          name='lastName'
                          value={values.lastName}
                          placeholder={t('lumifi', 'patients.addPatient.placeholders.lastName')}
                          required
                          onChange={handleChange}
                          onClear={handleClear}
                          errorMessage={touched.lastName && errors.lastName ? errors.lastName : ''}
                        />
                        <div>
                          <label
                            htmlFor='role'
                            className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                          >
                            {t('lumifi', 'patients.addPatient.labels.dob')} *
                          </label>
                          <DatePicker
                            selected={
                              values.dob && dayjs(values.dob, 'MM-DD-YYYY', true).isValid()
                                ? dayjs(values.dob, 'MM-DD-YYYY', true).toDate()
                                : null
                            }
                            onChange={(date: Date | null) => {
                              if (date) {
                                setFieldValue('dob', dayjs(date).format('MM-DD-YYYY'));
                              } else {
                                setFieldValue('dob', '');
                              }
                            }}
                            dateFormat='MM-dd-yyyy'
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode='select'
                            placeholderText={t('lumifi', 'patients.addPatient.placeholders.dob')}
                            maxDate={new Date()}
                            className={`w-full px-3 h-11 rounded-[4px] text-[#4E5053] placeholder:text-[#BBC0C3] text-base font-medium leading-4 focus:outline-none
                            ${
                              touched.dob && errors.dob
                                ? 'border border-red-500'
                                : values.dob
                                  ? 'border border-black'
                                  : 'border border-[#D6DBDE]'
                            }`}
                            wrapperClassName='w-full'
                          />

                          {touched.dob && errors.dob && (
                            <div className='text-sm text-red-500 font-medium'>{errors.dob}</div>
                          )}
                        </div>

                        <TextField
                          label={t('lumifi', 'patients.addPatient.labels.email')}
                          name='email'
                          value={values.email || ''}
                          placeholder={t('lumifi', 'patients.addPatient.placeholders.email')}
                          onChange={handleChange}
                          onClear={handleClear}
                          type='email'
                          errorMessage={touched.email && errors.email ? errors.email : ''}
                        />

                        <PhoneInputField
                          label={t('lumifi', 'patients.addPatient.labels.phone')}
                          name='phone'
                          value={values.phone as string}
                          placeholder={t('lumifi', 'patients.addPatient.placeholders.phone')}
                          onChange={(phone) => {
                            const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                            setFieldValue('phone', formattedPhone);
                          }}
                          onClear={handleClear}
                          errorMessage={touched.phone && errors.phone ? errors.phone : ''}
                        />

                        <div className='flex justify-center items-center gap-5 w-full pt-6'>
                          <button
                            type='button'
                            onClick={handleCancel}
                            className='flex justify-center items-center gap-1 text-[#009BDF] text-lg font-medium w-28 h-10 focus:outline-none disabled:cursor-not-allowed'
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
          </div>
        </div>
      </div>
    </>
  );
};
