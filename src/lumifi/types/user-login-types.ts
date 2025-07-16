export interface ILoginUser {
  emailId: string;
  password: string;
}

export interface IPracticeAccount {
  id: string;
  practice_name: string;
}

export interface ILoginResponse {
  message: string;
  status: 'success' | 'failure';
  loginId: string;
  emailId?: string;
  practiceAccountList: IPracticeAccount[];
}

export interface IVerifyOtp {
  loginId: string;
  emailId: string;
  otp: string;
}

export interface ITwoFaResponse {
  message: string;
  status: string;
}

export interface ISelectUserPracticeRequest {
  loginId: string;
  emailId: string;
  practiceAccountId: string;
}

export interface IUserPracticeTypeItem {
  id: string;
  practice_name: string;
}

export interface IUserPracticeTypeResponse {
  message: string;
  status: string;
  loginId: string;
  userId: string;
  emailId: string;
  has2fa: boolean;
  otp: string;
}

export interface IPracticeAccountTypePayload {
  loginId: string;
  userId: string;
  practiceAccountId: string;
  emailId: string;
}

export interface IResendOtp {
  loginId: string;
  emailId: string;
}

export interface IResendOtpResponse {
  message: string;
  status: string;
  otp: string;
}

// For user details after login
export interface IUserDetails {
  id: string;
  readable_id: string;
  practice_account_id: string;
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  role_id: string;
  role: string;
  dea: string;
  license_number: string;
  state_of_issue: string;
  password: string;
  has_2fa: boolean;
  active_status: boolean;
  account_verified: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string | null;
  doctor_email_id: string;
}

export interface IUserResponse {
  message: string;
  status: 'success' | 'failure';

  // Optional fields returned only on success
  authToken?: string;
  refreshToken?: string;
  exp?: number;
  userDetails?: IUserDetails;
}

export interface IAuthRefreshTokenPayload {
  loginId: string;
  userId: string;
  refreshToken: string;
}

export interface IAuthRefreshResponse {
  message: string;
  status: 'success' | 'failure';
  statusCode: number;

  // Optional Fileds
  authToken?: string;
  exp?: number;
}
