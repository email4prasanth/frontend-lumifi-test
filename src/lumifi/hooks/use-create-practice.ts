import { t } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  GetAccountAdminAvailabilityApi,
  GetPracticeSoftwareListApi,
  GetPracticeSpecialtyListApi,
  GetUserRolesListApi,
  GetUserStatesListApi,
  PostCreatePracticeAccountApi,
} from '../api';
import type {
  ICreatePracticeRequest,
  IGetPracticeSoftwareList,
  IGetPracticeSpecialtyList,
  IGetStatesList,
  IGetUserRole,
} from '../types';

export const useCreatePractice = () => {
  // Practice Software
  const [practiceSoftwareList, setPracticeSoftwareList] = useState<IGetPracticeSoftwareList[]>([]);
  const [isPracticeSoftwareListLoading, setIsPracticeSoftwareListLoading] = useState<boolean>(false);
  const fetchPracticeSoftwareList = () => {
    setIsPracticeSoftwareListLoading(true);
    GetPracticeSoftwareListApi()
      .then((res) => {
        setPracticeSoftwareList(res);
      })
      .catch((err) => {
        console.error('Failed to fetch practice software list:', err);
        setIsPracticeSoftwareListLoading(false);
      })
      .finally(() => {
        setIsPracticeSoftwareListLoading(false);
      });
  };

  // User Roles
  const [userRolesList, setUserRolesList] = useState<IGetUserRole[]>([]);
  const [isUserRolesListLoading, setIsUserRolesListLoading] = useState<boolean>(false);
  const fetchUserRolesList = () => {
    setIsUserRolesListLoading(true);
    GetUserRolesListApi()
      .then((res) => {
        setUserRolesList(res);
      })
      .catch((err) => {
        console.error('Failed to fetch user roles list:', err);
        setIsUserRolesListLoading(false);
      })
      .finally(() => {
        setIsUserRolesListLoading(false);
      });
  };

  // Practice Specialty
  const [practiceSpecialtyList, setPracticeSpecialtyList] = useState<IGetPracticeSpecialtyList[]>([]);
  const [isPracticeSpecialtyListLoading, setIsPracticeSpecialtyListLoading] = useState<boolean>(false);
  const fetchPracticeSpecialtyList = () => {
    setIsPracticeSpecialtyListLoading(true);
    GetPracticeSpecialtyListApi()
      .then((res) => {
        setPracticeSpecialtyList(res);
      })
      .catch((err) => {
        console.error('Failed to fetch practice specialty list:', err);
        setIsPracticeSpecialtyListLoading(false);
      })
      .finally(() => {
        setIsPracticeSpecialtyListLoading(false);
      });
  };

  // User States
  const [userStatesList, setUserStatesList] = useState<IGetStatesList[]>([]);
  const [isUserStatesListLoading, setIsUserStatesListLoading] = useState<boolean>(false);
  const fetchUserStatesList = () => {
    setIsUserStatesListLoading(true);
    GetUserStatesListApi()
      .then((res) => {
        setUserStatesList(res);
      })
      .catch((err) => {
        console.error('Failed to fetch user states list:', err);
        setIsUserStatesListLoading(false);
      })
      .finally(() => {
        setIsUserStatesListLoading(false);
      });
  };

  const [isPracticeAccountCreating, setIsPracticeAccountCreating] = useState(false);
  const createPracticeAccount = (practiceDetail: ICreatePracticeRequest, onComplete: () => void) => {
    setIsPracticeAccountCreating(true);
    PostCreatePracticeAccountApi(practiceDetail)
      .then(() => {
        toast.success(t('lumifi', 'practiceAccount.success'));
        setIsPracticeAccountCreating(false);
        onComplete();
      })
      .catch(() => {
        setIsPracticeAccountCreating(false);
      });
  };

  const checkAccountAdminAvailability = async (accountAdmin: string) => {
    return await GetAccountAdminAvailabilityApi(accountAdmin);
  };

  return {
    // Practice Software
    practiceSoftwareList,
    isPracticeSoftwareListLoading,
    fetchPracticeSoftwareList,

    // User Roles
    userRolesList,
    isUserRolesListLoading,
    fetchUserRolesList,

    // Practice Specialty
    practiceSpecialtyList,
    isPracticeSpecialtyListLoading,
    fetchPracticeSpecialtyList,

    // User States
    userStatesList,
    isUserStatesListLoading,
    fetchUserStatesList,

    isPracticeAccountCreating,
    createPracticeAccount,

    checkAccountAdminAvailability,
  };
};
