import type { IGetPracticeSoftwareList } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/practice/software';

export const GetPracticeSoftwareListApi = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as IGetPracticeSoftwareList[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
