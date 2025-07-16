import { act, renderHook } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi, type Mock, type MockedFunction } from 'vitest';
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
import { useManageDoctor } from './use-manage-doctors';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn() },
}));
vi.mock('../api');

describe('useManageDoctor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches doctor list successfully', async () => {
    const mockList: IDoctor[] = [{ id: '1' } as IDoctor];
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
    (PostDoctorListApi as unknown as Mock).mockResolvedValueOnce({
      list: mockList,
      pagination: {
        currentPage: 1,
        rowsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        previousPage: null,
      } as IPagination,
    });

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.getDoctorList({} as IDoctorListRequest);
    });

    expect(result.current.doctorList).toEqual(mockList);
    expect(result.current.doctorPagination).toEqual(mockPagination);
    expect(result.current.isDoctorListFetching).toBe(false);
  });

  it('handles error in fetching doctor list', async () => {
    (PostDoctorListApi as unknown as Mock<typeof PostDoctorListApi>).mockRejectedValueOnce(new Error('fail'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.getDoctorList({} as IDoctorListRequest);
    });

    expect(result.current.isDoctorListFetching).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('fetches doctor details successfully', async () => {
    const mockDoctor: IGetDoctorRes = { id: '1' } as IGetDoctorRes;
    (GetDoctorApi as unknown as Mock<typeof GetDoctorApi>).mockResolvedValueOnce(mockDoctor);

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.fetchDoctorDetails('1');
    });

    expect(result.current.doctorDetails).toEqual(mockDoctor);
    expect(result.current.isDoctorFetching).toBe(false);
  });

  it('handles error in fetching doctor details', async () => {
    (GetDoctorApi as unknown as Mock<typeof GetDoctorApi>).mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.fetchDoctorDetails('1');
    });

    expect(result.current.isDoctorFetching).toBe(false);
  });

  it('creates doctor successfully', async () => {
    (PostCreateDoctorApi as unknown as Mock<typeof PostCreateDoctorApi>).mockResolvedValueOnce({
      message: 'created',
      status: '',
    });
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.createDoctor({} as ICreateDoctorPayload, onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('created');
    expect(result.current.isDoctorCreating).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles error in creating doctor', async () => {
    (PostCreateDoctorApi as unknown as Mock<typeof PostCreateDoctorApi>).mockRejectedValueOnce(new Error('fail'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.createDoctor({} as ICreateDoctorPayload, onComplete);
    });

    expect(result.current.isDoctorCreating).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('updates doctor successfully', async () => {
    (PutDoctorApi as MockedFunction<typeof PutDoctorApi>).mockResolvedValueOnce({
      message: 'updated',
      status: 'completed',
    });
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.updateDoctor({} as IUpdateDoctorPayload, onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('updated');
    expect(result.current.isDoctorUpdating).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles error in updating doctor', async () => {
    (PutDoctorApi as MockedFunction<typeof PutDoctorApi>).mockRejectedValueOnce(new Error('fail'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.updateDoctor({} as IUpdateDoctorPayload, onComplete);
    });

    expect(result.current.isDoctorUpdating).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('deletes doctor successfully', async () => {
    (DeleteDoctorApi as unknown as Mock<typeof DeleteDoctorApi>).mockResolvedValueOnce({
      message: 'deleted',
      status: 'completed',
    });
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.deleteDoctor('1', onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('deleted');
    expect(result.current.isDoctorDeleting).toBe(false);
    expect(onComplete).toHaveBeenCalledWith('success');
  });

  it('handles error in deleting doctor', async () => {
    (DeleteDoctorApi as unknown as Mock<typeof DeleteDoctorApi>).mockRejectedValueOnce(new Error('fail'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      result.current.deleteDoctor('1', onComplete);
    });

    expect(result.current.isDoctorDeleting).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('fetches doctor dependencies successfully', async () => {
    const mockStates: IGetStatesList[] = [
      {
        id: '1',
        dial_code: '+1',
        state_name: 'Test State',
        state_abbr: 'TS',
      },
    ];
    const mockRoles: IGetUserRole[] = [
      { id: 1, role_name: 'Doctor' } as unknown as IGetUserRole,
      { id: 2, role_name: 'Admin' } as unknown as IGetUserRole,
    ];
    (GetDoctorStatesListApi as unknown as Mock<typeof GetDoctorStatesListApi>).mockResolvedValueOnce(mockStates);
    (GetUserRolesListApi as unknown as Mock<typeof GetUserRolesListApi>).mockResolvedValueOnce(mockRoles);

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      await result.current.fetchDoctorDependencies();
    });

    expect(result.current.availableStatesForDoctor).toEqual(mockStates);
    expect(result.current.doctorRole).toEqual({ id: 1, role_name: 'Doctor' });
    expect(result.current.isDoctorDependenciesLoading).toBe(false);
  });

  it('handles error in fetching doctor dependencies', async () => {
    (GetDoctorStatesListApi as unknown as Mock<typeof GetDoctorStatesListApi>).mockRejectedValueOnce(new Error('fail'));
    (GetUserRolesListApi as unknown as Mock<typeof GetUserRolesListApi>).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useManageDoctor());
    await act(async () => {
      await result.current.fetchDoctorDependencies();
    });

    expect(result.current.isDoctorDependenciesLoading).toBe(false);
  });
});
