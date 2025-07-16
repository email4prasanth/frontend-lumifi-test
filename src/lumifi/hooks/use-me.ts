import { setMeUser } from '@/store/slices/me';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PostMeApi } from '../api';
import type { IMeUser, IMeUserPayload } from '../types';

export const useUserDetail = () => {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);

  const fetchUserDetail = (MeUserPayload: IMeUserPayload) => {
    setIsFetching(true);
    PostMeApi(MeUserPayload)
      .then((res) => {
        dispatch(setMeUser(res.userDetails as IMeUser));
        setIsFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    fetchUserDetail,
  };
};
