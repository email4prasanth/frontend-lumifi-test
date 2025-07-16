import { arrowRightIcon, closeIcon } from '@/assets/images';
import { Autocomplete } from '@/lib/ui/components/auto-complete';
import { Dropdown } from '@/lib/ui/components/drop-down';
import { Image } from '@/lib/ui/components/image';
import { PhoneInputField } from '@/lib/ui/components/phone-input';
import { TextField } from '@/lib/ui/components/text-field';
import { H2 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import type { IGetPracticeSoftwareList, IGetPracticeSpecialtyList, IGetStatesList, PracticeInfo } from '@/lumifi/types';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import * as Yup from 'yup';

interface PracticeInfoFormProps {
  onNext: (data: PracticeInfo) => void;
  userStatesList: IGetStatesList[];
  practiceSpecialtyList: IGetPracticeSpecialtyList[];
  practiceSoftwareList: IGetPracticeSoftwareList[];
}

const validationSchema = Yup.object({
  practiceName: Yup.string().required(t('lumifi', 'practiceInfo.errors.practiceName')),
  address: Yup.string().required(t('lumifi', 'practiceInfo.errors.address')),
  address2: Yup.string().required(t('lumifi', 'practiceInfo.errors.address2')),
  city: Yup.string().required(t('lumifi', 'practiceInfo.errors.city')),
  state: Yup.string().required(t('lumifi', 'practiceInfo.errors.state')),
  zip: Yup.string()
    .required(t('lumifi', 'practiceInfo.errors.zip.required'))
    .test('is-us-zip', t('lumifi', 'practiceInfo.errors.zip.invalid'), (value) => {
      if (!value) return false;
      return validator.isPostalCode(value, 'US');
    }),
  officeEmail: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
  officePhone: Yup.string()
    .required(t('lumifi', 'practiceInfo.errors.officePhone.required'))
    .test('valid-phone', t('lumifi', 'practiceInfo.errors.officePhone.invalid'), (value) => {
      if (!value) return false;
      // Remove all non-digit characters except +
      const digits = value.replace(/[^\d+]/g, '');
      // Validate US numbers
      if (digits.startsWith('+1')) {
        return digits.length === 12; // +1 + 10 digits
      }
      // Validate UK numbers
      if (digits.startsWith('+44')) {
        return digits.length === 13; // +44 + 10 digits
      }
      return false;
    }),
  webLink: Yup.string().matches(
    /^(https?:\/\/)?(www\.)?[a-z0-9]+([.-]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    t('lumifi', 'practiceInfo.errors.webLink')
  ),
  specialty: Yup.string().required(t('lumifi', 'practiceInfo.errors.specialty')),
  practiceManagementSoftware: Yup.string(),
});

export const PracticeInfoForm = React.memo(
  ({ onNext, userStatesList, practiceSpecialtyList, practiceSoftwareList }: PracticeInfoFormProps) => {
    const navigate = useNavigate();

    const initialValues: PracticeInfo = {
      practiceName: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      officeEmail: '',
      officePhone: '',
      webLink: '',
      specialty: '',
      specialityId: '',
      practiceSoftwareId: '',
      practiceManagementSoftware: '',
    };

    // API data to UI options

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

    const specialtyOptions = useMemo(() => {
      let _practiceSpecialityList: { label: string; value: string; id: string }[] = [];
      if (practiceSpecialtyList.length > 0) {
        _practiceSpecialityList = practiceSpecialtyList?.map((specialty) => ({
          label: specialty.speciality_name,
          value: specialty.speciality_name,
          id: specialty.id,
        }));
      }
      return _practiceSpecialityList;
    }, [practiceSpecialtyList]);

    const practiceManagementSoftwareOptions = useMemo(() => {
      let _practiceManagementSoftwareOptions: { label: string; value: string; id: string }[] = [];
      if (practiceSoftwareList.length > 0) {
        _practiceManagementSoftwareOptions = practiceSoftwareList?.map((software) => ({
          label: software.software_name,
          value: software.software_name,
          id: software.id,
        }));
      }
      return _practiceManagementSoftwareOptions;
    }, [practiceSoftwareList]);

    const handleSubmit = (values: PracticeInfo) => {
      onNext(values);
    };

    const requiredFields: (keyof PracticeInfo)[] = [
      'practiceName',
      'address',
      'address2',
      'city',
      'state',
      'zip',
      'officePhone',
      'specialty',
    ];

    return (
      <div className='w-full'>
        <div className='w-full flex justify-center items-center text-center border-b-[3px] border-[#005399]'>
          <H2
            data-testid='practice-title'
            className='text-xl sm:text-2xl text-[#255294] font-medium mb-6'
          >
            {t('lumifi', 'practiceInfo.title')}
          </H2>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnMount
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => {
            const handleClear = (fieldName: string) => setFieldValue(fieldName, '');
            const allFieldsFilled = requiredFields.every((field) => values[field]?.trim() !== '');
            return (
              <Form
                data-testid='practice-info-form'
                className='space-y-5 mt-10'
              >
                <TextField
                  id='practice-name'
                  label={t('lumifi', 'practiceInfo.practiceName.label')}
                  name='practiceName'
                  value={values.practiceName}
                  placeholder={t('lumifi', 'practiceInfo.practiceName.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.practiceName && errors.practiceName ? errors.practiceName : ''}
                />
                <TextField
                  id='practice-address1'
                  label={t('lumifi', 'practiceInfo.address.label')}
                  name='address'
                  value={values.address}
                  placeholder={t('lumifi', 'practiceInfo.address.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.address && errors.address ? errors.address : ''}
                />
                <TextField
                  id='practice-address2'
                  label={t('lumifi', 'practiceInfo.address2.label')}
                  name='address2'
                  required
                  value={values.address2}
                  placeholder={t('lumifi', 'practiceInfo.address2.placeholder')}
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.address2 && errors.address2 ? errors.address2 : ''}
                />
                <TextField
                  id='practice-city'
                  label={t('lumifi', 'practiceInfo.city.label')}
                  name='city'
                  value={values.city}
                  placeholder={t('lumifi', 'practiceInfo.city.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.city && errors.city ? errors.city : ''}
                />
                <div>
                  <label
                    data-testid='label-state'
                    htmlFor='state'
                    className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                  >
                    {t('lumifi', 'practiceInfo.state.label')}
                  </label>
                  <Autocomplete
                    options={stateOptions}
                    selectedOption={stateOptions.find((option) => option.value === values.state) || null}
                    onSelect={(selectedOption) => setFieldValue('state', selectedOption.value)}
                    placeholder={t('lumifi', 'practiceInfo.state.placeholder')}
                  />
                  {touched.state && errors.state && (
                    <p className='text-[11px] text-[#DB5656] font-medium'>{errors.state}</p>
                  )}
                </div>
                <TextField
                  id='practice-zip'
                  label={t('lumifi', 'practiceInfo.zip.label')}
                  name='zip'
                  value={values.zip}
                  placeholder={t('lumifi', 'practiceInfo.zip.placeholder')}
                  required
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.zip && errors.zip ? errors.zip : ''}
                />
                <TextField
                  id='practice-office-email'
                  label={t('lumifi', 'practiceInfo.officeEmail.label')}
                  name='officeEmail'
                  value={values.officeEmail || ''}
                  placeholder={t('lumifi', 'practiceInfo.officeEmail.placeholder')}
                  type='email'
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.officeEmail && errors.officeEmail ? errors.officeEmail : ''}
                />
                <PhoneInputField
                  id='practice-office-phone'
                  label={t('lumifi', 'practiceInfo.officePhone.label')}
                  name='officePhone'
                  value={values.officePhone}
                  placeholder={t('lumifi', 'practiceInfo.officePhone.placeholder')}
                  required
                  onChange={(phone) => {
                    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                    setFieldValue('officePhone', formattedPhone);
                  }}
                  onClear={handleClear}
                  errorMessage={touched.officePhone && errors.officePhone ? errors.officePhone : ''}
                />
                <TextField
                  id='practice-web-link'
                  label={t('lumifi', 'practiceInfo.webLink.label')}
                  name='webLink'
                  value={values.webLink || ''}
                  placeholder={t('lumifi', 'practiceInfo.webLink.placeholder')}
                  onChange={handleChange}
                  onClear={handleClear}
                  errorMessage={touched.webLink && errors.webLink ? errors.webLink : ''}
                />
                <div>
                  <label
                    data-testid='label-specialty'
                    htmlFor='specialty'
                    className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                  >
                    {t('lumifi', 'practiceInfo.specialty.label')}
                  </label>
                  <Dropdown
                    id='practice-speciality'
                    options={specialtyOptions}
                    selectedOption={specialtyOptions.find((option) => option.value === values.specialty) || null}
                    onSelect={(selectedOption) => {
                      setFieldValue('specialty', selectedOption.value);
                      setFieldValue('specialityId', selectedOption.id);
                    }}
                    placeholder={t('lumifi', 'practiceInfo.specialty.placeholder')}
                  />
                  {touched.specialty && errors.specialty && (
                    <p className='text-[11px] text-[#DB5656] font-medium'>{errors.specialty}</p>
                  )}
                </div>
                <div>
                  <label
                    data-testid='label-software'
                    htmlFor='practiceManagementSoftware'
                    className='block text-base leading-5 font-semibold text-[#4E5053] mb-1'
                  >
                    {t('lumifi', 'practiceInfo.practiceManagementSoftware.label')}
                  </label>
                  <Dropdown
                    id='practice-software'
                    options={practiceManagementSoftwareOptions}
                    selectedOption={
                      practiceManagementSoftwareOptions.find(
                        (option) => option.value === values.practiceManagementSoftware
                      ) || null
                    }
                    onSelect={(selectedOption) => {
                      setFieldValue('practiceManagementSoftware', selectedOption.value);
                      setFieldValue('practiceSoftwareId', selectedOption.id);
                    }}
                    placeholder={t('lumifi', 'practiceInfo.practiceManagementSoftware.placeholder')}
                  />
                </div>

                <div className='flex justify-center items-center gap-5 w-full pt-6'>
                  <button
                    data-testid='cancel-button'
                    onClick={() => navigate('/login')}
                    type='button'
                    className='flex justify-center items-center text-lg font-medium gap-1 text-[#009BDF] w-28 h-10 cursor-pointer focus:outline-none disabled:cursor-not-allowed'
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
                    className='flex justify-center items-center gap-3 text-lg font-medium bg-[#009BDF] text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
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
  }
);
