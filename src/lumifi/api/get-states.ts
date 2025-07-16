import type { IGetStatesList } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/state/list';

export const GetUserStatesListApi = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as IGetStatesList[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
