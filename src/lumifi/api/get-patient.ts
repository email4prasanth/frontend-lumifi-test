import type { IGetPatientResponse } from '../types/patient.type';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/patient/detail';

export const GetPatientApi = async (patientId: string) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?id=${patientId}`);
    return response as unknown as IGetPatientResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
