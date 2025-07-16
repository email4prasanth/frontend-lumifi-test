import type { IUpdateUserPayload, IUpdateUserRes } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/user/update';

export const PutUserApi = async (updateUserPayload: IUpdateUserPayload) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}`, updateUserPayload);
    return response as unknown as IUpdateUserRes;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
