import { arrowRightIcon, closeIcon } from '@/assets/images';
import { Autocomplete } from '@/lib/ui/components/auto-complete';
import { Dropdown } from '@/lib/ui/components/drop-down';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { PhoneInputField } from '@/lib/ui/components/phone-input';
import { TextField } from '@/lib/ui/components/text-field';
import { t } from '@/lib/utils';
import { isValidZipCode } from '@/lib/utils/zip-code';
import { usePracticeInfo } from '@/lumifi/hooks';
import type { PracticeInfo } from '@/lumifi/types';
import type { RootState } from '@/store/store';
import { Form, Formik } from 'formik';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

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
      return isValidZipCode(value);
    }),
  officeEmail: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
  officePhone: Yup.string()
    .required(t('lumifi', 'practiceInfo.errors.officePhone.required'))
    .test('valid-phone', t('lumifi', 'practiceInfo.errors.officePhone.invalid'), (value) => {
      if (!value) return false;
      const digits = value.replace(/[^\d+]/g, '');
      if (digits.startsWith('+1')) {
        return digits.length === 12;
      }
      if (digits.startsWith('+44')) {
        return digits.length === 13;
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

export const PracticeInfoEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const practice_account_id = useSelector((state: RootState) => state.me.details?.practice_account_id);
  const { practiceInfo } = location.state || {};
  const {
    isListFetching,
    softwareList,
    specialtyList,
    stateList,
    fetchList,
    isPracticeInfoUpdating,
    updatePracticeInfo,
  } = usePracticeInfo();

  useEffect(() => {
    if (!location.state?.practiceInfo) {
      navigate('/settings/practice-info');
    } else {
      fetchList();
    }
  }, [location.state, navigate]);

  const initialValues: PracticeInfo = {
    practiceName: practiceInfo?.practice_name || '',
    address: practiceInfo?.address1 || '',
    address2: practiceInfo?.address2 || '',
    city: practiceInfo?.city || '',
    state: practiceInfo?.state || '',
    zip: practiceInfo?.zip || '',
    officeEmail: practiceInfo?.office_email || '',
    officePhone: practiceInfo?.office_phone || '',
    webLink: practiceInfo?.website_address || '',
    specialty: practiceInfo?.speciality_name || '',
    specialityId: practiceInfo?.speciality_id || '',
    practiceSoftwareId: practiceInfo?.practice_software_id || '',
    practiceManagementSoftware: practiceInfo?.practice_software_name || '',
  };

  // API data to UI options
  const stateOptions = useMemo(() => {
    let _stateOptions: { label: string; value: string; id: string }[] = [];
    if (stateList.length > 0) {
      _stateOptions = stateList?.map((state) => ({
        label: state.state_name,
        value: state.state_name,
        id: state.id,
      }));
    }
    return _stateOptions;
  }, [stateList]);

  const specialtyOptions = useMemo(() => {
    let _practiceSpecialityList: { label: string; value: string; id: string }[] = [];
    if (specialtyList.length > 0) {
      _practiceSpecialityList = specialtyList?.map((specialty) => ({
        label: specialty.speciality_name,
        value: specialty.speciality_name,
        id: specialty.id,
      }));
    }
    return _practiceSpecialityList;
  }, [specialtyList]);

  const practiceManagementSoftwareOptions = useMemo(() => {
    let _practiceManagementSoftwareOptions: { label: string; value: string; id: string }[] = [];
    if (softwareList.length > 0) {
      _practiceManagementSoftwareOptions = softwareList?.map((software) => ({
        label: software.software_name,
        value: software.software_name,
        id: software.id,
      }));
    }
    return _practiceManagementSoftwareOptions;
  }, [softwareList]);

  const handleSubmit = (values: PracticeInfo) => {
    const payload = {
      id: practice_account_id as string,
      practiceName: values.practiceName,
      address1: values.address,
      address2: values.address2,
      city: values.city,
      state: values.state,
      zip: values.zip,
      officeEmail: values.officeEmail as string,
      officePhone: values.officePhone,
      websiteAddress: values.webLink as string,
      specialityId: values.specialityId,
      specialityName: values.specialty,
      practiceSoftwareId: values.practiceSoftwareId,
      practiceSoftwareName: values.practiceManagementSoftware as string,
      hasAcceptedTerms: practiceInfo.has_accepted_terms,
    };
    updatePracticeInfo(payload);
    navigate('/settings/practice-info');
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

  if (!location.state?.practiceInfo) {
    return null;
  }

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-6 sm:mb-10 border-b-[3px] border-[#D6DBDE] py-3'>
        <h3 className='text-xl sm:text-2xl font-semibold text-[#4E5053]'>Practice Info</h3>
      </div>
      {isListFetching ? (
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
            const allFieldsFilled = requiredFields.every((field) => values[field]?.trim() !== '');
            return (
              <Form className='pt-2 sm:pt-10 space-y-6 sm:max-w-[540px] mx-auto'>
                <TextField
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
                    data-testid='cancelButton'
                    onClick={() => navigate('/settings/practice-info')}
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
                    data-testid='nextButton'
                    type='submit'
                    disabled={!allFieldsFilled}
                    className='flex justify-center items-center gap-3 text-lg font-medium bg-[#009BDF] text-white w-28 h-10 rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
                  >
                    {isPracticeInfoUpdating ? (
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
