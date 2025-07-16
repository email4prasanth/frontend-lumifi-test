import type { IUserListRequest, IUserListResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/user/list';

export const PostUserListApi = async (userListPayload: IUserListRequest) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, userListPayload);
    return response as unknown as IUserListResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
