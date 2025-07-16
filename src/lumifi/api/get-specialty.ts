import type { IGetPracticeSpecialtyList } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/practice/speciality';

export const GetPracticeSpecialtyListApi = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as IGetPracticeSpecialtyList[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
