import type { ISetPasswordPayload, ISetPasswordResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/setPassword';

export const PostSetPasswordApi = async (setPasswordPayload: ISetPasswordPayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, setPasswordPayload);
    return response as unknown as ISetPasswordResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
