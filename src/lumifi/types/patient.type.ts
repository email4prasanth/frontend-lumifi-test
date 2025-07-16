export interface GetPatientPayload {
  firstName: string | null;
  lastName: string | null;
  dob: string | null;
}

export interface IPatient {
  id: string;
  readable_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  email_id: string;
  phone_number: string;
  active_status: boolean;
  implants: [];
}

export interface IPatientRequest {
  firstName: string;
  lastName: string;
  dob?: string;
}

export interface ICreatePatientPayload {
  firstName: string;
  lastName: string;
  dob: string;
  emailId: string;
  phoneNumber: string;
}

export interface ICreatePatientResponse {
  message: string;
  status: string;
}

export interface IUpdatePatientPayload {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  emailId: string;
  phoneNumber: string;
}

export interface IUpdatePatientResponse {
  message: string;
  status: string;
}

export interface IDeletePatientRes {
  message: string;
  status: string;
}

export interface IGetPatientResponse {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  emailId: string;
  phoneNumber: string;
}
