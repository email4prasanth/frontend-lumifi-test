import type { ICreatePracticeRequest } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/practice/register';

export const PostCreatePracticeAccountApi = async (createPractice: ICreatePracticeRequest) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, createPractice);
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
