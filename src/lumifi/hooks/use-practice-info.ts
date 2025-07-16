import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  GetPracticeInfoApi,
  GetPracticeSoftwareListApi,
  GetPracticeSpecialtyListApi,
  GetUserStatesListApi,
  PutPracticeInfoApi,
} from '../api';
import type {
  IGetPracticeInfo,
  IGetPracticeSoftwareList,
  IGetPracticeSpecialtyList,
  IGetStatesList,
  IUpdatePracticeInfo,
} from '../types';

export const usePracticeInfo = () => {
  // Get Practice Info Details
  const [isPracticeInfoFetching, setIsPracticeInfoFetching] = useState<boolean>(false);
  const [practiceInfo, setPracticeInfo] = useState<IGetPracticeInfo | null>(null);

  const getPracticeInfo = (practiceId: string) => {
    setIsPracticeInfoFetching(true);
    GetPracticeInfoApi(practiceId)
      .then((res) => {
        setPracticeInfo(res);
        setIsPracticeInfoFetching(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user roles list:', err);
        setIsPracticeInfoFetching(false);
      });
  };

  // Update Practice Info
  const [isPracticeInfoUpdating, setIsPracticeInfoUpdating] = useState<boolean>(false);

  const updatePracticeInfo = (practiceInfo: IUpdatePracticeInfo) => {
    setIsPracticeInfoUpdating(true);
    PutPracticeInfoApi(practiceInfo)
      .then((res) => {
        toast.success(res.message);
        setIsPracticeInfoUpdating(false);
      })
      .catch(() => {
        setIsPracticeInfoUpdating(false);
      });
  };

  const [isListFetching, setIsListFetching] = useState<boolean>(false);
  const [softwareList, setSoftwareList] = useState<IGetPracticeSoftwareList[]>([]);
  const [specialtyList, setSpecialtyList] = useState<IGetPracticeSpecialtyList[]>([]);
  const [stateList, setStateList] = useState<IGetStatesList[]>([]);

  const fetchList = () => {
    setIsListFetching(true);
    Promise.all([GetPracticeSoftwareListApi(), GetPracticeSpecialtyListApi(), GetUserStatesListApi()])
      .then(([softwareList, specialtyList, stateList]) => {
        setSoftwareList(softwareList);
        setSpecialtyList(specialtyList);
        setStateList(stateList);
        setIsListFetching(false);
      })
      .catch(() => {
        setIsListFetching(false);
      });
  };

  return {
    // Get Practice Info
    isPracticeInfoFetching,
    practiceInfo,
    getPracticeInfo,

    // Update Practice Info
    isPracticeInfoUpdating,
    updatePracticeInfo,

    // Fetch Lists
    isListFetching,
    softwareList,
    specialtyList,
    stateList,
    fetchList,
  };
};
