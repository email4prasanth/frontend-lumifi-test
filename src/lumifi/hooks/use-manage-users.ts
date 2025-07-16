import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  DeleteUserApi,
  GetUserApi,
  GetUserRolesListApi,
  PostCreateUserApi,
  PostUserListApi,
  PutSecurityDetailApi,
  PutUserApi,
} from '../api';
import type {
  ICreateUserPayload,
  IGetUserRes,
  IGetUserRole,
  IPagination,
  ISecurityUpdateRequest,
  IUpdateUserPayload,
  IUser,
  IUserListRequest,
} from '../types';

export const useManageUser = () => {
  // Fetch Users
  const [isUserListFetching, setIsUserListFetching] = useState<boolean>(false);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [userPagination, setUserPagination] = useState<IPagination | null>(null);

  const getUserList = (userListPayload: IUserListRequest) => {
    setIsUserListFetching(true);
    PostUserListApi(userListPayload)
      .then((res) => {
        const mapUserList = res.list.map((user) => ({
          ...user,
          hasActionMenu: user?.role === 'Account Owner' ? false : true,
        }));
        setUserList(mapUserList);
        setUserPagination(res.pagination);
        setIsUserListFetching(false);
      })
      .catch(() => {
        setIsUserListFetching(false);
      });
  };

  // Get User

  const [isUserFetching, setIsUserFetching] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IGetUserRes | null>(null);

  const fetchUserDetails = (userId: string) => {
    setIsUserFetching(true);
    GetUserApi(userId)
      .then((res) => {
        setUserDetails(res);
        setIsUserFetching(false);
      })
      .catch(() => {
        setIsUserFetching(false);
      });
  };

  // Create User
  const [isUserCreating, setIsUserCreating] = useState<boolean>(false);

  const createUser = (createUserPayload: ICreateUserPayload, onComplete: () => void) => {
    setIsUserCreating(true);
    PostCreateUserApi(createUserPayload)
      .then((res) => {
        toast.success(res.message);
        setIsUserCreating(false);
        onComplete();
      })
      .catch(() => {
        setIsUserCreating(false);
      });
  };

  // Update User
  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const updateUser = (updateUserPayload: IUpdateUserPayload, onComplete: () => void) => {
    setIsUserUpdating(true);
    PutUserApi(updateUserPayload)
      .then((res) => {
        toast.success(res.message);
        setIsUserUpdating(false);
        onComplete();
      })
      .catch(() => {
        setIsUserUpdating(false);
      });
  };

  //Delete user Api
  const [isUserDeleting, setIsUserDeleting] = useState<boolean>(false);

  const deleteUser = (userId: string, onComplete: (status: string) => void) => {
    setIsUserDeleting(true);
    DeleteUserApi(userId)
      .then((res) => {
        toast.success(res.message);
        setIsUserDeleting(false);
        onComplete('success');
      })
      .catch(() => {
        setIsUserDeleting(false);
      });
  };

  // fetch user dependencies
  const [isUserDependenciesLoading, setIsUserDependenciesLoading] = useState<boolean>(false);
  const [availableRolesForUser, setAvailableRolesForUser] = useState<IGetUserRole[]>([]);

  const fetchUserDependencies = () => {
    setIsUserDependenciesLoading(true);
    Promise.all([GetUserRolesListApi()])
      .then(([roleList]) => {
        const _roleList = roleList.filter(
          (role) => role?.role_name !== 'Doctor' && role?.role_name !== 'Account Owner'
        );
        setAvailableRolesForUser(_roleList);
        setIsUserDependenciesLoading(false);
      })
      .catch(() => {
        setIsUserDependenciesLoading(false);
      });
  };

  const [isSecurityUpdating, setIsSecurityUpdating] = useState<boolean>(false);
  const updateSecurityDetail = (
    securityUpdatePayload: ISecurityUpdateRequest,
    onComplete: (status: string) => void
  ) => {
    setIsSecurityUpdating(true);
    PutSecurityDetailApi(securityUpdatePayload)
      .then((res) => {
        setIsSecurityUpdating(false);

        toast.success(res.message);
        onComplete('success');
      })
      .catch(() => {
        setIsSecurityUpdating(false);
        onComplete('failure');
      });
  };

  return {
    // fetch Users List
    isUserListFetching,
    userList,
    userPagination,
    getUserList,

    // Create User
    isUserCreating,
    createUser,

    // Get User
    isUserFetching,
    userDetails,
    fetchUserDetails,

    // fetch user dependencies
    isUserDependenciesLoading,
    availableRolesForUser,
    fetchUserDependencies,

    // Update User
    isUserUpdating,
    updateUser,

    // Delete user Api
    isUserDeleting,
    deleteUser,

    // Update security
    updateSecurityDetail,
    isSecurityUpdating,
  };
};
