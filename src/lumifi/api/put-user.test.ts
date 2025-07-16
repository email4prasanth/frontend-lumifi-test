import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '../api/executer';
import type { IUpdateUserPayload, IUpdateUserRes } from '../types';
import { PutUserApi } from './put-user';

vi.mock('../api/executer', async () => {
  const actual = await vi.importActual('../api/executer');
  return {
    ...actual,
    axiosInstance: {
      put: vi.fn(),
    },
  };
});

describe('PutUserApi', () => {
  const mockPayload: IUpdateUserPayload = {
    id: 'user-001',
    firstName: 'John',
    lastName: 'Doe',
    emailId: 'john.doe@example.com',
    has2fa: true,
    phoneNumber: '1234567890',
    roleId: 'role-123',
    role: 'Admin',
    dea: 'DEA001',
    licenseNumber: 'LIC001',
    stateOfIssue: 'CA',
  };

  const mockResponse: IUpdateUserRes = {
    message: 'User updated successfully',
    status: 'success',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return response on successful user update', async () => {
    (axiosInstance.put as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await PutUserApi(mockPayload);

    expect(axiosInstance.put).toHaveBeenCalledWith('/user/update', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on failed user update', async () => {
    (axiosInstance.put as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Update failed'));

    await expect(PutUserApi(mockPayload)).rejects.toThrow('Update failed');
    expect(axiosInstance.put).toHaveBeenCalledWith('/user/update', mockPayload);
  });
});
