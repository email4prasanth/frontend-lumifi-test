import type { IPracticeAccountTypePayload, IUserResponse } from '../types/user-login-types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/completion';

export const PostAuthCompletionApi = async (practiceAccType: IPracticeAccountTypePayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, practiceAccType);
    return response as unknown as IUserResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
