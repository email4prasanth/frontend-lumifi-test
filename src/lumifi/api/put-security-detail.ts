import type { ISecurityUpdateRequest, ISecurityUpdateResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/security/update';

export const PutSecurityDetailApi = async (securityUpdatePayload: ISecurityUpdateRequest) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}`, securityUpdatePayload);
    return response as unknown as ISecurityUpdateResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
