import type { ILoginResponse, ILoginUser } from '../types/user-login-types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/login';

export const PostLoginApi = async (loginUser: ILoginUser) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, loginUser);
    return response as unknown as ILoginResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
