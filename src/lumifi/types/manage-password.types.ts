export interface ISetPasswordPayload {
  credential: string;
  password: string;
}

export interface ISetPasswordResponse {
  message: string;
  status: string;
}

export interface IResetPasswordPayload extends ISetPasswordPayload {}

export interface IResetPasswordResponse extends ISetPasswordResponse {}
