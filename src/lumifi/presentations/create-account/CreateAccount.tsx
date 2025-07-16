import type {
  DoctorInfo,
  FormData,
  ICreatePracticeRequest,
  IGetUserRole,
  LoginInfo,
  PracticeInfo,
  TermsAndConditions,
  UsersInfo,
} from '@/lumifi/types';
import React, { useEffect, useState } from 'react';

import { Stepper } from './stepper';

import { Loader } from '@/lib/ui/components/loader';
import { H4 } from '@/lib/ui/components/typography';
import { t } from '@/lib/utils';
import { useCreatePractice } from '@/lumifi/hooks';

import { AddUsersInfo, CongratulationsStep, DoctorInfoForm, LoginInfoForm, PracticeInfoForm, TermsAgreement } from './';

const steps = [
  { id: 1, label: t('lumifi', 'createAcc.steps.practiceInfo') },
  { id: 2, label: t('lumifi', 'createAcc.steps.doctorInfo') },
  { id: 3, label: t('lumifi', 'createAcc.steps.createLogin') },
  { id: 4, label: t('lumifi', 'createAcc.steps.addUsers') },
];

export const RegisterForm: React.FC = () => {
  const { createPracticeAccount, isPracticeAccountCreating } = useCreatePractice();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    loginInfo: {} as LoginInfo,
    practiceInfo: {} as PracticeInfo,
    doctorInfo: {} as DoctorInfo,
    usersInfo: { users: [] },
    termsAndConditions: { agreed: false } as TermsAndConditions,
  });
  const [showCongratulations, setShowCongratulations] = useState(false);

  const {
    practiceSoftwareList,
    isPracticeSoftwareListLoading,
    fetchPracticeSoftwareList,
    userRolesList,
    isUserRolesListLoading,
    fetchUserRolesList,
    practiceSpecialtyList,
    isPracticeSpecialtyListLoading,
    fetchPracticeSpecialtyList,
    userStatesList,
    isUserStatesListLoading,
    fetchUserStatesList,
  } = useCreatePractice();

  useEffect(() => {
    fetchPracticeSoftwareList();
    fetchUserRolesList();
    fetchPracticeSpecialtyList();
    fetchUserStatesList();
  }, []);

  const initialLoading =
    isPracticeSoftwareListLoading ||
    isUserRolesListLoading ||
    isPracticeSpecialtyListLoading ||
    isUserStatesListLoading;

  const handleNext = (data: LoginInfo | PracticeInfo | DoctorInfo | { users: UsersInfo[] }, step: keyof FormData) => {
    setFormData((prevData) => ({ ...prevData, [step]: data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleSkipAddUsers = () => {
    setFormData((prevData) => ({
      ...prevData,
      usersInfo: { users: [], skipped: true }, // Mark as skipped with empty array
    }));
    setCurrentStep((prev) => prev + 1);
  };

  const mapToPayload = (formData: FormData): ICreatePracticeRequest => {
    const { doctorInfo, loginInfo, practiceInfo, usersInfo, termsAndConditions } = formData;
    return {
      practiceInfo: {
        practiceName: practiceInfo.practiceName,
        address1: practiceInfo.address,
        address2: practiceInfo.address2,
        city: practiceInfo.city,
        state: practiceInfo.state,
        zip: practiceInfo.zip,
        officeEmail: practiceInfo.officeEmail as string,
        officePhone: practiceInfo.officePhone,
        websiteAddress: practiceInfo.webLink as string,
        specialityId: practiceInfo.specialityId,
        specialityName: practiceInfo.specialty,
        practiceSoftwareId: practiceInfo.practiceSoftwareId,
        practiceSoftwareName: practiceInfo.practiceManagementSoftware as string,
        hasAcceptedTerms: termsAndConditions.agreed ?? false,
        countryId: 'e18d0925-38e4-4149-b1f1-11d5c3d891eb',
        country: 'USA',
      },
      doctorInfo: {
        firstName: doctorInfo.firstName,
        lastName: doctorInfo.lastName,
        doctorEmailId: doctorInfo.email as string,
        emailId: loginInfo.email,
        phoneNumber: loginInfo.mobileNumber,
        has2fa: loginInfo.twoFactorAuthEnabled as boolean,
        roleId: (userRolesList.find((role) => role.role_name === 'Account Owner') as IGetUserRole).id, // replace account owner role directly from role list hook value
        role: 'Account Owner', // replace account owner role directly from role list hook value
        dea: doctorInfo.deaNumber,
        licenseNumber: doctorInfo.licenseNumber as string,
        stateOfIssue: doctorInfo.licenseState as string,
        password: loginInfo.password,
      },
      userInfo: usersInfo?.users?.map((user) => ({
        firstName: user.userFirstName,
        lastName: user.userLastName,
        emailId: user.email,
        has2fa: user.twoFactorAuthEnabled,
        phoneNumber: user.mobileNumber,
        roleId: user.roleId,
        role: user.role,
        dea: user.docInfo?.deaNumber ?? '',
        licenseNumber: user.docInfo?.licenseNumber ?? '',
        stateOfIssue: user.docInfo?.licenseState ?? '',
      })) as [],
    };
  };

  const onComplete = () => {
    setShowCongratulations(true);
  };

  const handleFinish = async () => {
    createPracticeAccount(mapToPayload(formData), onComplete);
  };

  const needsVerification = formData.doctorInfo?.hasNoDea;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PracticeInfoForm
            onNext={(data: PracticeInfo) => handleNext(data, 'practiceInfo')}
            userStatesList={userStatesList}
            practiceSpecialtyList={practiceSpecialtyList}
            practiceSoftwareList={practiceSoftwareList}
          />
        );
      case 1:
        return (
          <DoctorInfoForm
            onNext={(data: DoctorInfo) => handleNext(data, 'doctorInfo')}
            userStatesList={userStatesList}
          />
        );
      case 2:
        return (
          <LoginInfoForm
            onNext={(data: LoginInfo) => handleNext(data, 'loginInfo')}
            initialEmail={formData.doctorInfo.email}
          />
        );
      case 3:
        return (
          <AddUsersInfo
            onNext={(data: { users: UsersInfo[] }) => handleNext(data, 'usersInfo')}
            onSkip={handleSkipAddUsers}
            userRolesList={userRolesList}
            userStatesList={userStatesList}
          />
        );
      case 4:
        return (
          <TermsAgreement
            onFinish={handleFinish}
            termsAndConditions={formData.termsAndConditions}
            onAgreementChange={(agreed) =>
              setFormData((prev) => ({
                ...prev,
                termsAndConditions: { agreed },
              }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='bg-white rounded-md w-full my-6 sm:my-11 max-w-xl p-5 sm:p-7 sm:pb-16 shadow-none sm:shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]'>
        {initialLoading && <Loader overlay={true} />}
        <H4 className='text-lg font-medium  text-[#4E5053] text-center mb-8'>
          {t('lumifi', 'createAcc.createAccount')}
        </H4>
        <Stepper
          steps={steps}
          currentStep={currentStep}
        />
        {showCongratulations ? (
          <CongratulationsStep needsVerification={needsVerification} />
        ) : isPracticeAccountCreating ? (
          <div className='flex flex-col justify-center items-center h-[350px]'>
            <Loader overlay={false} />
          </div>
        ) : (
          renderStepContent()
        )}
        {!showCongratulations && currentStep !== 4 && !isPracticeAccountCreating && (
          <div className='text-center mt-14 text-xs font-normal text-black'>
            {t('lumifi', 'common.troubleRegistering')}
            <span className='pl-1 cursor-pointer underline font-medium text-[#009BDF]'>
              {t('lumifi', 'common.contactSupport')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
