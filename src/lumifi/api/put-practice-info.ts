import type { IUpdatePracticeInfo, IUpdatePracticeInfoRes } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/practice/update';

export const PutPracticeInfoApi = async (practiceInfo: IUpdatePracticeInfo) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}`, practiceInfo);
    return response as unknown as IUpdatePracticeInfoRes;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
