import type { ICreatePatientPayload, ICreatePatientResponse } from '../types/patient.type';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/patient/create';

export const PostCreatePatientsApi = async (createPatientPayload: ICreatePatientPayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, createPatientPayload);
    return response as unknown as ICreatePatientResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
