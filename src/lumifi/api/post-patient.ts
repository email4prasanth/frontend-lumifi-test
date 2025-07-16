import type { GetPatientPayload, IPatient } from '../types/patient.type';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/patient/search';

export const PostPatientApi = async (searchPatientPayload: GetPatientPayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, searchPatientPayload);
    return response as unknown as IPatient[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
