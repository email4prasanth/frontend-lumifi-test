export interface IGetPracticeInfo {
  id: string;
  readable_id: string;
  practice_name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  office_email: string;
  office_phone: string;
  website_address: string;
  speciality_id: string;
  speciality_name: string;
  practice_software_id: string;
  practice_software_name: string;
  has_accepted_terms: boolean;
  active_status: boolean;
  account_verified: boolean;
  country_id: string;
  country: string;
  created_at: string;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
