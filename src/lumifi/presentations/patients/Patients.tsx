import {
  dentalImage,
  dentalImageRight,
  greenTickIcon,
  notePadUserIcon,
  plusIcon,
  searchWhiteIcon,
} from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import { ButtonLoader, Loader } from '@/lib/ui/components/loader';
import { H2 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { usePatient } from '@/lumifi/hooks';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

export const Patients: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [dob, setDob] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { isPatientFetching, patientInfo, fetchPatientInfo, resetPatientInfo } = usePatient();

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirstName = firstName?.trim() ?? '';
    const trimmedLastName = lastName?.trim() ?? '';
    const trimmedDob = dob?.trim() ?? '';

    if (!trimmedFirstName && !trimmedLastName && !trimmedDob) {
      return;
    }

    setHasSearched(true);
    fetchPatientInfo({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      dob: trimmedDob,
    });
  };

  // Enable the search button when all fields are filled in
  const isSearchDisabled = !firstName?.trim() || !lastName?.trim() || !dob?.trim();

  const handleClear = () => {
    setFirstName('');
    setLastName('');
    setDob('');
    setHasSearched(false);
    resetPatientInfo();
  };

  const handleAddImplant = (patientId: string) => {
    navigate('/patients/add-implant', { state: { patientId } });
  };

  return (
    <div className='container mx-auto px-4 sm:px-8'>
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className='mb-8 border-t border-b border-[#009BDF] py-5'
      >
        <div className='flex flex-col md:flex-row gap-4 flex-wrap'>
          <p className='text-lg font-medium text-[#4E5053] py-2'>{t('lumifi', 'patients.title')}</p>
          <input
            type='text'
            placeholder={t('lumifi', 'patients.placeHolder.firstName')}
            value={firstName as string}
            onChange={(e) => setFirstName(e.target.value)}
            className={`px-3 flex flex-grow h-11 border ${
              firstName ? 'border-[#4E5053]' : 'border-[#D6DBDE]'
            } text-[#4E5053] placeholder:text-[#BBC0C3] text-base font-medium leading-4 rounded-[4px] focus:outline-none`}
          />
          <input
            type='text'
            placeholder={t('lumifi', 'patients.placeHolder.lastName')}
            value={lastName as string}
            onChange={(e) => setLastName(e.target.value)}
            className={`px-3 flex flex-grow h-11 border ${
              lastName ? 'border-[#4E5053]' : 'border-[#D6DBDE]'
            } text-[#4E5053] placeholder:text-[#BBC0C3] text-base font-medium leading-4 rounded-[4px] focus:outline-none`}
          />
          <DatePicker
            selected={dob ? new Date(dob) : null}
            onChange={(date: Date | null) => {
              if (date) {
                setDob(dayjs(date).format('YYYY-MM-DD'));
              } else {
                setDob('');
              }
            }}
            placeholderText={t('lumifi', 'patients.placeHolder.dob')}
            className={`px-3 h-11 border ${
              dob ? 'border-[#4E5053]' : 'border-[#D6DBDE]'
            } text-[#4E5053] placeholder:text-[#BBC0C3] text-base font-medium leading-4 rounded-[4px] focus:outline-none`}
            dateFormat='MM-dd-yyyy'
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
            maxDate={new Date()}
          />
          <div className='flex-grow flex justify-between gap-4'>
            {hasSearched ? (
              <button
                type='button'
                onClick={handleClear}
                className='text-sm font-semibold uppercase tracking-widest text-[#009BDF] hover:font-bold w-24 h-11 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              >
                {t('lumifi', 'common.clear')}
              </button>
            ) : (
              <div className='w-24 h-11'></div>
            )}
            <button
              type='submit'
              disabled={isSearchDisabled || isPatientFetching}
              className='w-40 h-11 flex justify-center items-center gap-3 bg-[#009BDF] text-lg font-medium text-white rounded-[4px] focus:outline-none disabled:bg-[#038ECB4D] disabled:cursor-not-allowed'
            >
              {isPatientFetching ? (
                <ButtonLoader
                  size={20}
                  color='white'
                />
              ) : (
                <>
                  <Image
                    src={searchWhiteIcon}
                    alt='search-icon'
                    className='w-6 h-6'
                  />
                  <span> {t('lumifi', 'common.search')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      {isPatientFetching && (
        <div className='flex flex-col justify-center items-center h-[350px]'>
          <Loader overlay={false} />
        </div>
      )}

      {/* Results */}
      {!isPatientFetching && hasSearched && (
        <>
          {patientInfo.length > 0 ? (
            <div className='mb-8'>
              {/* If multiple matches */}
              {patientInfo.length > 1 && (
                <div className='w-full text-center py-5'>
                  <H2 className='text-2xl font-semibold text-[#005399]'>
                    {t('lumifi', 'patients.searchPatient.multipleMatchesTitle')}
                  </H2>
                  <p className='text-[#4E5053] text-lg font-semibold'>
                    {t('lumifi', 'patients.searchPatient.multipleMatchesSub')}
                  </p>
                </div>
              )}

              {/* Results List */}
              <div className={patientInfo.length === 1 ? 'flex justify-center' : 'grid lg:grid-cols-2 gap-6'}>
                {patientInfo.map((patient) => (
                  <div
                    key={patient.id}
                    className='flex justify-center items-stretch'
                  >
                    <div
                      className={`bg-white rounded-md w-full ${
                        patientInfo.length === 1 ? 'w-auto md:min-w-[580px] my-6 sm:my-11' : 'max-w-[550px] my-3'
                      } p-5 sm:p-7 sm:pb-10 shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]`}
                    >
                      {/* Single match notice */}
                      {patientInfo.length === 1 && (
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center justify-center gap-2 text-[#4E5053]'>
                            <Image
                              src={greenTickIcon}
                              className='w-6 h-6'
                            />
                            <span className='text-xl font-medium'>
                              {t('lumifi', 'patients.searchPatient.matchFound')}
                            </span>
                          </div>
                          <p className='text-base ms:text-lg font-medium text-center text-[#4E5053]'>
                            {t('lumifi', 'patients.searchPatient.subMessage')}
                          </p>
                        </div>
                      )}

                      {/* Patient Info */}
                      <div className='w-full flex flex-col justify-center items-center text-center border-b-[3px] border-[#005399] mt-8'>
                        <h2 className='text-xl sm:text-2xl text-[#255294] font-medium'>
                          {patient.first_name} {patient.last_name}
                        </h2>
                        <p className='text-black text-sm sm:text-lg leading-[22px] font-medium mb-6 break-words whitespace-pre-wrap'>
                          <span className='text-[#7F7F7F]'>{t('lumifi', 'common.dob')} </span>
                          {patient.dob}
                        </p>
                      </div>

                      {/* Implant Table */}
                      <div className='flex flex-col justify-center items-center mt-10 mb-3'>
                        <h4 className='text-lg font-medium text-[#4E5053] mb-2'>
                          {' '}
                          {t('lumifi', 'patients.implantRecords.title')}
                        </h4>
                        <div className='w-9/12'>
                          <table className='w-full mb-10'>
                            <thead>
                              <tr className='border-b border-t text-sm text-[#4E5053]'>
                                <th className='text-center p-3 font-medium'>
                                  {t('lumifi', 'patients.implantRecords.tooth')}
                                </th>
                                <th className='text-center p-3 font-medium'>
                                  {t('lumifi', 'patients.implantRecords.date')}
                                </th>
                              </tr>
                            </thead>
                            {/* <tbody>
                              {patient.implants && patient.implants.length > 0 ? (
                                patient.implants.map((implant) => (
                                  <tr
                                    key={`${implant.toothNumber}-${implant.treatmentDate}`}
                                    className='border-b text-sm text-[#555555] font-medium'
                                  >
                                    <td className='text-center p-3'>{implant.toothNumber}</td>
                                    <td className='text-center p-3'>{implant.treatmentDate}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr className='border-b text-sm text-[#555555] font-medium'>
                                  <td className='text-center p-3'>{t('lumifi', 'patients.implantRecords.noData')}</td>
                                  <td className='text-center p-3'>{t('lumifi', 'patients.implantRecords.noData')}</td>
                                </tr>
                              )}
                            </tbody> */}
                          </table>
                        </div>

                        {/* Actions */}
                        <div className={`flex flex-col gap-3 ${patientInfo.length === 1 ? '' : 'pb-5 md:pb-14'}`}>
                          <button
                            onClick={() => handleAddImplant(patient.id)}
                            className='w-52 h-11 flex justify-center items-center gap-2 bg-[#009BDF] text-lg font-medium text-white rounded-[4px] focus:outline-none'
                          >
                            <Image
                              src={plusIcon}
                              alt='plus-icon'
                              className='w-5 h-5'
                            />
                            <span>{t('lumifi', 'common.addImplant')}</span>
                          </button>
                          <button
                            onClick={() => navigate('/patients/chart')}
                            className='w-52 h-11 flex justify-center items-center gap-2 border border-[#009BDF] text-lg font-medium text-[#009BDF] rounded-[4px] focus:outline-none'
                          >
                            <Image
                              src={notePadUserIcon}
                              alt='note-icon'
                              className='w-4 h-4p-2'
                            />
                            <span>{t('lumifi', 'common.viewChart')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='py-12 w-full flex flex-col justify-center items-center'>
              <div className='max-w-[720px] flex flex-col justify-center items-center gap-2 mb-10'>
                <h2 className='text-lg sm:text-2xl font-semibold text-[#005399]'>
                  {' '}
                  {t('lumifi', 'patients.searchPatient.noMatchesTitle')}
                </h2>
                <p className='text-lg font-medium text-center text-[#4E5053]'>
                  {t('lumifi', 'patients.searchPatient.noMatchesSub')}
                </p>
              </div>
              <button
                onClick={() => navigate('/patients/add')}
                className='w-48 h-11 flex justify-center items-center gap-2 bg-[#009BDF] text-lg font-medium text-white rounded-[4px] focus:outline-none'
              >
                <Image
                  src={plusIcon}
                  alt='plus-icon'
                  className='w-5 h-5'
                />
                <span> {t('lumifi', 'common.addPatient')}</span>
              </button>
              <Image
                src={dentalImage}
                alt='no matches'
                className='w-full max-w-xs md:max-w-sm mx-auto my-8 opacity-75'
              />
            </div>
          )}
        </>
      )}

      {/* Initial message */}
      {!hasSearched && !isPatientFetching && (
        <div className='py-12'>
          <div className='flex flex-col justify-center items-center gap-2 mb-10'>
            <h2 className='text-lg sm:text-2xl font-semibold text-[#005399]'>
              {t('lumifi', 'patients.initial.step1')}
            </h2>
            <p className='text-lg sm:text-2xl font-medium text-[#4B9BDE]'>{t('lumifi', 'patients.initial.sub')}</p>
          </div>
          <Image
            src={dentalImageRight}
            alt='no matches'
            className='w-full max-w-xs md:max-w-sm mx-auto my-8 opacity-75'
          />
        </div>
      )}

      <div
        className={`w-full text-center space-y-1 my-6 ${patientInfo && hasSearched && patientInfo.length === 1 ? 'block' : 'hidden'}`}
      >
        <p className='text-base font-medium text-[#4E5053]'>
          {' '}
          {t('lumifi', 'patients.searchPatient.notYourPatient.title')}
        </p>
        <p className='text-sm font-normal text-[#4E5053]'>
          {t('lumifi', 'patients.searchPatient.notYourPatient.line1')}{' '}
          <button
            onClick={() => navigate('/patients/add')}
            className='text-[#009BDF] font-medium focus:outline-none cursor-pointer'
          >
            {t('lumifi', 'patients.searchPatient.notYourPatient.linkText')}
          </button>
        </p>
        <p className='text-sm font-normal text-[#4E5053]'>
          {t('lumifi', 'patients.searchPatient.notYourPatient.line2')}
        </p>
      </div>
    </div>
  );
};
