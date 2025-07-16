export interface ISecurityUpdateRequest {
  emailId: string;
  phoneNumber: string;
}

export interface ISecurityUpdateResponse {
  message: string;
  status: string;
}
