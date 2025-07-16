import type { IUpdatePatientPayload, IUpdatePatientResponse } from '../types/patient.type';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/patient/update';

export const PutPatientApi = async (updatePatientPayload: IUpdatePatientPayload) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}`, updatePatientPayload);
    return response as unknown as IUpdatePatientResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
