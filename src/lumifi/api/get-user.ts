import type { IGetUserRes } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/user/detail';

export const GetUserApi = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?userId=${userId}`);
    return response as unknown as IGetUserRes;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
