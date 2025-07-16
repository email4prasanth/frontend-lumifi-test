import type { IPagination } from './common.types';

export interface IUser {
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
  state_id?: string | null;
  state_of_issue: string;
  has_2fa: boolean;
  active_status: boolean;
  doctor_email_id?: string | null;
  account_verified: boolean;
  hasActionMenu: boolean;
}

export interface IUserListRequest {
  practiceAccountId: string;
  page: number;
  limit: number;
  role: string;
}

export interface IUserListResponse {
  pagination: IPagination;
  list: IUser[];
}

export interface ICreateUserPayload {
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
}

export interface ICreateUserRes {
  message: string;
  status: string;
}

export interface IDeleteUserRes {
  message: string;
  status: string;
}

export interface IUpdateUserPayload {
  id: string;
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
}

export interface IUpdateUserRes {
  message: string;
  status: string;
}

export interface IGetUserRes {
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
  has_2fa: boolean;
  active_status: boolean;
  is_password_active: boolean;
  password_reset_at: string;
  is_password_reset: boolean;
  doctor_email_id: string;
  account_verified: boolean;
}
