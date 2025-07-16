import { act, renderHook } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi, type Mock, type MockedFunction } from 'vitest';
import {
  DeleteUserApi,
  GetUserApi,
  GetUserRolesListApi,
  GetUserStatesListApi,
  PostCreateUserApi,
  PostUserListApi,
  PutUserApi,
} from '../api';
import type {
  ICreateUserPayload,
  IGetStatesList,
  IGetUserRes,
  IGetUserRole,
  IPagination,
  IUpdateUserPayload,
  IUser,
  IUserListRequest,
} from '../types';
import { useManageUser } from './use-manage-users';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn() },
}));
vi.mock('../api');

describe('useManageUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches user list successfully', async () => {
    const mockList: IUser[] = [{ id: '1' } as IUser];
    const mockPagination: IPagination = {
      currentPage: 1,
      rowsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null,
    };
    (PostUserListApi as unknown as Mock).mockResolvedValueOnce({
      list: mockList,
      pagination: mockPagination,
    });

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.getUserList({} as IUserListRequest);
    });

    expect(result.current.userList).toEqual(mockList);
    expect(result.current.userPagination).toEqual(mockPagination);
    expect(result.current.isUserListFetching).toBe(false);
  });

  it('handles error in fetching user list', async () => {
    (PostUserListApi as unknown as Mock<typeof PostUserListApi>).mockRejectedValueOnce(new Error('fail'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.getUserList({} as IUserListRequest);
    });

    expect(result.current.isUserListFetching).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('fetches user details successfully', async () => {
    const mockUser: IGetUserRes = { id: '1' } as IGetUserRes;
    (GetUserApi as unknown as Mock<typeof GetUserApi>).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.fetchUserDetails('1');
    });

    expect(result.current.userDetails).toEqual(mockUser);
    expect(result.current.isUserFetching).toBe(false);
  });

  it('handles error in fetching user details', async () => {
    (GetUserApi as unknown as Mock<typeof GetUserApi>).mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.fetchUserDetails('1');
    });

    expect(result.current.isUserFetching).toBe(false);
  });

  it('creates user successfully', async () => {
    (PostCreateUserApi as unknown as Mock<typeof PostCreateUserApi>).mockResolvedValueOnce({
      message: 'created',
      status: '',
    });
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.createUser({} as ICreateUserPayload, onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('created');
    expect(result.current.isUserCreating).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles error in creating user', async () => {
    (PostCreateUserApi as unknown as Mock<typeof PostCreateUserApi>).mockRejectedValueOnce(new Error('fail'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.createUser({} as ICreateUserPayload, onComplete);
    });

    expect(result.current.isUserCreating).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('updates user successfully', async () => {
    (PutUserApi as MockedFunction<typeof PutUserApi>).mockResolvedValueOnce({
      message: 'updated',
      status: 'completed',
    });
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.updateUser({} as IUpdateUserPayload, onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('updated');
    expect(result.current.isUserUpdating).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles error in updating user', async () => {
    (PutUserApi as MockedFunction<typeof PutUserApi>).mockRejectedValueOnce(new Error('fail'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.updateUser({} as IUpdateUserPayload, onComplete);
    });

    expect(result.current.isUserUpdating).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('deletes user successfully', async () => {
    (DeleteUserApi as unknown as Mock<typeof DeleteUserApi>).mockResolvedValueOnce({
      message: 'deleted',
      status: 'completed',
    });
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.deleteUser('1', onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('deleted');
    expect(result.current.isUserDeleting).toBe(false);
    expect(onComplete).toHaveBeenCalledWith('success');
  });

  it('handles error in deleting user', async () => {
    (DeleteUserApi as unknown as Mock<typeof DeleteUserApi>).mockRejectedValueOnce(new Error('fail'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.deleteUser('1', onComplete);
    });

    expect(result.current.isUserDeleting).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('fetches user dependencies successfully', async () => {
    const mockStates: IGetStatesList[] = [
      {
        id: '1',
        dial_code: '+1',
        state_name: 'Test State',
        state_abbr: 'TS',
      },
    ];
    const mockRoles: IGetUserRole[] = [
      { id: 1, role_name: 'Admin' } as unknown as IGetUserRole,
      { id: 2, role_name: 'Account Owner' } as unknown as IGetUserRole,
    ];
    (GetUserStatesListApi as unknown as Mock<typeof GetUserStatesListApi>).mockResolvedValueOnce(mockStates);
    (GetUserRolesListApi as unknown as Mock<typeof GetUserRolesListApi>).mockResolvedValueOnce(mockRoles);

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      await result.current.fetchUserDependencies();
    });

    expect(result.current.availableStatesForUser).toEqual(mockStates);
    expect(result.current.availableRolesForUser).toEqual([{ id: 1, role_name: 'Admin' }]);
    expect(result.current.isUserDependenciesLoading).toBe(false);
  });

  it('handles error in fetching user dependencies', async () => {
    (GetUserStatesListApi as unknown as Mock<typeof GetUserStatesListApi>).mockRejectedValueOnce(new Error('fail'));
    (GetUserRolesListApi as unknown as Mock<typeof GetUserRolesListApi>).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      await result.current.fetchUserDependencies();
    });

    expect(result.current.isUserDependenciesLoading).toBe(false);
  });
});
