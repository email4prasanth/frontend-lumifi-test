import type { IResetPasswordResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/forgotPassword';

export const GetResetPasswordLinkApi = async (emailId: string) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?emailId=${emailId}`);
    return response as unknown as IResetPasswordResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
