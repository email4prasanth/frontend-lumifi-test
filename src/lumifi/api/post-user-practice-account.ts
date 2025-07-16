import type { ISelectUserPracticeRequest, IUserPracticeTypeResponse } from '../types/user-login-types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/selectLoginPracticeAccount';

export const PostUserPracticeAccountApi = async (userPracticePayload: ISelectUserPracticeRequest) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, userPracticePayload);
    return response as unknown as IUserPracticeTypeResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
