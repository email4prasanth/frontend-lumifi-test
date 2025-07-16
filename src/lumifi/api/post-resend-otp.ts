import type { IResendOtp, IResendOtpResponse } from '../types/user-login-types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/resendOtp';

export const PostResendOtpApi = async (resendOtp: IResendOtp) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, resendOtp);
    return response as unknown as IResendOtpResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
