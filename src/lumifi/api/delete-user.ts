import type { IDeleteUserRes } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/user/delete';

export const DeleteUserApi = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}?userId=${userId}`);
    return response as unknown as IDeleteUserRes;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
