export interface IMeUserPayload {
  userId: string;
  practiceAccountId: string;
}

export interface IMeUser {
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

export interface IMeResponse {
  message: string;
  status: string;
  userDetails: Partial<IMeUser>;
}
