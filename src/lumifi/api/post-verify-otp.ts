import type { ITwoFaResponse, IVerifyOtp } from '../types/user-login-types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/verifyOtp';

export const PostVerifyOtpApi = async (verifyOtp: IVerifyOtp) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, verifyOtp);
    return response as unknown as ITwoFaResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
