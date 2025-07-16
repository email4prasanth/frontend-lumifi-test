import type { IMeResponse, IMeUserPayload } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/me';

export const PostMeApi = async (MeUserPayload: IMeUserPayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, MeUserPayload);
    return response as unknown as IMeResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
