import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  DeleteUserApi as DeleteDoctorApi,
  GetUserApi as GetDoctorApi,
  GetUserStatesListApi as GetDoctorStatesListApi,
  GetUserRolesListApi,
  PostCreateUserApi as PostCreateDoctorApi,
  PostUserListApi as PostDoctorListApi,
  PutUserApi as PutDoctorApi,
} from '../api';
import type {
  ICreateDoctorPayload,
  IDoctor,
  IDoctorListRequest,
  IGetDoctorRes,
  IGetStatesList,
  IGetUserRole,
  IPagination,
  IUpdateDoctorPayload,
} from '../types';

export const useManageDoctor = () => {
  // Fetch Doctors
  const [isDoctorListFetching, setIsDoctorListFetching] = useState<boolean>(false);
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);
  const [doctorPagination, setDoctorPagination] = useState<IPagination | null>(null);

  const getDoctorList = (doctorListPayload: IDoctorListRequest) => {
    setIsDoctorListFetching(true);
    PostDoctorListApi(doctorListPayload)
      .then((res) => {
        setDoctorList(res.list);
        setDoctorPagination(res.pagination);
        setIsDoctorListFetching(false);
      })
      .catch((err) => {
        console.error('Failed to fetch doctors list:', err);
        setIsDoctorListFetching(false);
      });
  };

  // Get Doctor
  const [isDoctorFetching, setIsDoctorFetching] = useState<boolean>(false);
  const [doctorDetails, setDoctorDetails] = useState<IGetDoctorRes | null>(null);

  const fetchDoctorDetails = (doctorId: string) => {
    setIsDoctorFetching(true);
    GetDoctorApi(doctorId)
      .then((res) => {
        setDoctorDetails(res);
        setIsDoctorFetching(false);
      })
      .catch(() => {
        setIsDoctorFetching(false);
      });
  };

  // Create Doctor
  const [isDoctorCreating, setIsDoctorCreating] = useState<boolean>(false);

  const createDoctor = (createDoctorPayload: ICreateDoctorPayload, onComplete: () => void) => {
    setIsDoctorCreating(true);
    PostCreateDoctorApi(createDoctorPayload)
      .then((res) => {
        toast.success(res.message);
        setIsDoctorCreating(false);
        onComplete();
      })
      .catch(() => {
        setIsDoctorCreating(false);
      });
  };

  // Update Doctor
  const [isDoctorUpdating, setIsDoctorUpdating] = useState<boolean>(false);

  const updateDoctor = (updateDoctorPayload: IUpdateDoctorPayload, onComplete: () => void) => {
    setIsDoctorUpdating(true);
    PutDoctorApi(updateDoctorPayload)
      .then((res) => {
        toast.success(res.message);
        setIsDoctorUpdating(false);
        onComplete();
      })
      .catch(() => {
        setIsDoctorUpdating(false);
      });
  };

  // Delete Doctor
  const [isDoctorDeleting, setIsDoctorDeleting] = useState<boolean>(false);

  const deleteDoctor = (doctorId: string, onComplete: (status: string) => void) => {
    setIsDoctorDeleting(true);
    DeleteDoctorApi(doctorId)
      .then((res) => {
        toast.success(res.message);
        setIsDoctorDeleting(false);
        onComplete('success');
      })
      .catch(() => {
        setIsDoctorDeleting(false);
      });
  };

  // Fetch Doctor Dependencies
  const [isDoctorDependenciesLoading, setIsDoctorDependenciesLoading] = useState<boolean>(false);
  const [availableStatesForDoctor, setAvailableStatesForDoctor] = useState<IGetStatesList[]>([]);
  const [doctorRole, setDoctorRole] = useState<IGetUserRole>();

  const fetchDoctorDependencies = () => {
    setIsDoctorDependenciesLoading(true);
    Promise.all([GetDoctorStatesListApi(), GetUserRolesListApi()])
      .then(([stateList, roleList]) => {
        setAvailableStatesForDoctor(stateList);
        const _roleList = roleList.find((role) => role?.role_name === 'Doctor');
        setDoctorRole(_roleList);
        setIsDoctorDependenciesLoading(false);
      })
      .catch(() => {
        setIsDoctorDependenciesLoading(false);
      });
  };

  return {
    // Doctor List
    isDoctorListFetching,
    doctorList,
    doctorPagination,
    getDoctorList,

    // Doctor Details
    isDoctorFetching,
    doctorDetails,
    fetchDoctorDetails,

    // Create Doctor
    isDoctorCreating,
    createDoctor,

    // Update Doctor
    isDoctorUpdating,
    updateDoctor,

    // Delete Doctor
    isDoctorDeleting,
    deleteDoctor,

    // Dependencies
    isDoctorDependenciesLoading,
    availableStatesForDoctor,
    fetchDoctorDependencies,
    doctorRole,
  };
};
