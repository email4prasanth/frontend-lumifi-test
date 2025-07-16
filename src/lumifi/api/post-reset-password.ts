import type { IResetPasswordPayload, IResetPasswordResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/resetPassword';

export const PostResetPasswordApi = async (resetPasswordPayload: IResetPasswordPayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, resetPasswordPayload);
    return response as unknown as IResetPasswordResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
