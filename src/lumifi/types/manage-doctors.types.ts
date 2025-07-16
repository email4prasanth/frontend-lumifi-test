import type { IPagination } from './common.types';

// Base Doctor Type
export interface IDoctor {
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
  doctor_email_id: string;
  account_verified: boolean;
}

// Request to list doctors
export interface IDoctorListRequest {
  practiceAccountId: string;
  page: number;
  limit: number;
  role: string;
}

// Paginated list response
export interface IDoctorListResponse {
  pagination: IPagination;
  list: IDoctor[];
}

// Payload to create a doctor
export interface ICreateDoctorPayload {
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

// Response after creating a doctor
export interface ICreateDoctorRes {
  message: string;
  status: string;
}

// Response after deleting a doctor
export interface IDeleteDoctorRes {
  message: string;
  status: string;
}

// Payload to update a doctor
export interface IUpdateDoctorPayload {
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

// Response after updating a doctor
export interface IUpdateDoctorRes {
  message: string;
  status: string;
}

// Response for getting a doctor's details
export interface IGetDoctorRes {
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
  doctor_email_id: string;
  account_verified: boolean;
}
