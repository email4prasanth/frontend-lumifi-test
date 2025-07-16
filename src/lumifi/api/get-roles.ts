import type { IGetUserRole } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/user/role';

export const GetUserRolesListApi = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as IGetUserRole[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
