import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GetUserRolesListApi } from './get-roles';
import { axiosInstance } from './executer';
import type { IGetUserRole } from '../types';

vi.mock('./executer', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe('GetUserRolesListApi', () => {
  const mockRoles: IGetUserRole[] = [
    { id: '1', role_name: 'Admin' },
    { id: '2', role_name: 'User' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the correct API endpoint and returns roles', async () => {
    (axiosInstance.get as Mock).mockResolvedValue(mockRoles);

    const result = await GetUserRolesListApi();

    expect(axiosInstance.get).toHaveBeenCalledWith('/user/role');
    expect(result).toEqual(mockRoles);
  });

  it('throws an error when the API call fails', async () => {
    (axiosInstance.get as Mock).mockRejectedValue(new Error('API error'));

    await expect(GetUserRolesListApi()).rejects.toThrow('API error');
  });
});
