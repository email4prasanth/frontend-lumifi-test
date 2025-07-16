import type { IAccountAdminAvailabilityResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/practice/accountAdminAvailability';

export const GetAccountAdminAvailabilityApi = async (emailId: string): Promise<IAccountAdminAvailabilityResponse> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?emailId=${emailId}`);
    return response as unknown as IAccountAdminAvailabilityResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
