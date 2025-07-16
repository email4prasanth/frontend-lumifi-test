export interface LoginInfo {
  email: string;
  password: string;
  twoFactorAuthEnabled?: boolean;
  mobileNumber: string;
}

export interface PracticeInfo {
  practiceName: string;
  address: string;
  address2: string;
  city: string;
  state: string;

  zip: string;
  officeEmail?: string;
  officePhone: string;
  officeFax?: string;
  webLink?: string;
  specialty: string;
  specialityId: string;
  practiceSoftwareId: string;
  practiceManagementSoftware?: string;
}

export interface DoctorInfo {
  id?: string;
  firstName: string;
  doctorEmail?: string;
  lastName: string;
  email: string;
  deaNumber: string;
  hasNoDea: boolean;
  licenseNumber?: string;
  licenseState?: string;
}

export interface UserDocInfo {
  deaNumber: string;
  hasNoDea: boolean;
  licenseNumber?: string;
  licenseState?: string;
}

export interface UsersInfo {
  id?: string;
  userFirstName: string;
  userLastName: string;
  mobileNumber?: string;
  email: string;
  twoFactorAuthEnabled?: boolean;
  role: string;
  roleId?: string;
  docInfo?: UserDocInfo;
  skipped?: boolean;
}

export interface TermsAndConditions {
  agreed: boolean;
}

export interface FormData {
  loginInfo: LoginInfo;
  practiceInfo: PracticeInfo;
  doctorInfo: DoctorInfo;
  usersInfo: {
    users: UsersInfo[];
    skipped?: boolean;
  };
  termsAndConditions: TermsAndConditions;
}

// API interfaces

export interface IGetStatesList {
  id: string;
  dial_code: string;
  state_name: string;
  state_abbr: string;
}

export interface IGetPracticeSoftwareList {
  id: string;
  software_name: string;
}

export interface IGetUserRole {
  id: string;
  role_name: string;
}

export interface IGetPracticeSpecialtyList {
  id: string;
  speciality_name: string;
}

export interface PracticeInformation {
  practiceName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  officeEmail: string;
  officePhone: string;
  websiteAddress: string;
  specialityId: string;
  specialityName: string;
  practiceSoftwareId: string;
  practiceSoftwareName: string;
  hasAcceptedTerms: boolean;
  countryId: string;
  country: string;
}

export interface UserInformation {
  firstName: string;
  lastName: string;
  emailId: string;
  has2fa: boolean;
  phoneNumber: string;
  roleId: string;
  role: string;
  dea: string;
  licenseNumber: string;
  stateOfIssue: string;
  password: string;
}

export interface DoctorInformation extends UserInformation {
  doctorEmailId: string;
}

export interface ICreatePracticeRequest {
  practiceInfo: PracticeInformation;
  doctorInfo: DoctorInformation;
  userInfo: UserInformation[];
}

export interface IPracticeNameAvailabilityResponse {
  status: string;
  message: string;
}

export interface IAccountAdminAvailabilityResponse {
  status: string;
  message: string;
}
