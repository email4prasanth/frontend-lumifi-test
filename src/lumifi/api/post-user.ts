import type { ICreateUserPayload, ICreateUserRes } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/user/create';

export const PostCreateUserApi = async (createUserPayload: ICreateUserPayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, createUserPayload);
    return response as unknown as ICreateUserRes;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
