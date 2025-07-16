export interface IUpdatePracticeInfo {
  id: string;
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
}

export interface IUpdatePracticeInfoRes {
  message: string;
  status: string;
  id: string;
}
