import type { IGetPracticeInfo } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/practice';

export const GetPracticeInfoApi = async (practiceId: string) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?id=${practiceId}`);
    return response as unknown as IGetPracticeInfo;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
