import { useState } from 'react';
import { toast } from 'react-toastify';
import { GetPatientApi, PostCreatePatientsApi, PostPatientApi, PutPatientApi } from '../api';
import type {
  GetPatientPayload,
  ICreatePatientPayload,
  IGetPatientResponse,
  IPatient,
  IUpdatePatientPayload,
} from '../types/patient.type';

export const usePatient = () => {
  // Find Patient Info/
  const [isPatientFetching, setIsPatientFetching] = useState(false);
  const [patientInfo, setPatientInfo] = useState<IPatient[]>([]);

  const fetchPatientInfo = async (searchPatientPayload: GetPatientPayload) => {
    // setPatientInfo([]);
    setIsPatientFetching(true);
    PostPatientApi(searchPatientPayload)
      .then((res) => {
        setPatientInfo(res);
        setIsPatientFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setIsPatientFetching(false);
      });
  };

  // Reset Patient Info
  const resetPatientInfo = () => {
    setPatientInfo([]);
  };

  // Get Patient Info

  const [isPatientInfoFetching, setIsPatientInfoFetching] = useState<boolean>(false);
  const [patientDetails, setPatientDetails] = useState<IGetPatientResponse | null>(null);

  const fetchPatientDetails = (patientId: string) => {
    setIsPatientInfoFetching(true);
    GetPatientApi(patientId)
      .then((res) => {
        setPatientDetails(res);
        setIsPatientInfoFetching(false);
      })
      .catch((error) => {
        console.error('Error Fetching Patient: ', error);
        setIsPatientInfoFetching(false);
      });
  };

  // Create Patient Info
  const [isPatientCreating, setIsPatientCreating] = useState(false);

  const createPatient = (createPatientPayload: ICreatePatientPayload, onComplete: () => void) => {
    setIsPatientCreating(true);
    PostCreatePatientsApi(createPatientPayload)
      .then((res) => {
        toast.success(res.message);
        setIsPatientCreating(false);
        onComplete();
      })
      .catch((error) => {
        console.error('Error Creating Patient: ', error);
        setIsPatientCreating(false);
      });
  };

  // Update Patient Info
  const [isUpdatingPatient, setIsUpdatingPatient] = useState(false);

  const updatePatient = (updatePatientPayload: IUpdatePatientPayload, onComplete: () => void) => {
    setIsUpdatingPatient(true);
    PutPatientApi(updatePatientPayload)
      .then((res) => {
        toast.success(res.message);
        setIsUpdatingPatient(false);
        onComplete();
      })
      .catch((error) => {
        console.error('Error Updating Patient: ', error);
        setIsUpdatingPatient(false);
      });
  };

  return {
    // Find Patient Info
    isPatientFetching,
    patientInfo,
    fetchPatientInfo,

    // Reset Patient Info
    resetPatientInfo,

    // Get Patient Info
    isPatientInfoFetching,
    patientDetails,
    fetchPatientDetails,

    // Create Patient
    isPatientCreating,
    createPatient,

    // Update Patient Info
    isUpdatingPatient,
    updatePatient,
  };
};
