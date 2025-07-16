import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '../api/executer';
import type { IGetUserRes } from '../types';
import { GetUserApi } from './get-user';

vi.mock('../api/executer', async () => {
  const actual = await vi.importActual('../api/executer');
  return {
    ...actual,
    axiosInstance: {
      get: vi.fn(),
    },
  };
});

describe('GetUserApi', () => {
  const mockUserId = '12345';
  const mockResponse: IGetUserRes = {
    id: '12345',
    readable_id: 'U-001',
    practice_account_id: 'PA-999',
    first_name: 'John',
    last_name: 'Doe',
    email_id: 'john@example.com',
    phone_number: '1234567890',
    role_id: 'R-1',
    role: 'Doctor',
    dea: 'DEA123',
    license_number: 'LIC456',
    state_of_issue: 'CA',
    has_2fa: true,
    active_status: true,
    doctor_email_id: 'doc@example.com',
    account_verified: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user data on successful API call', async () => {
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await GetUserApi(mockUserId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/user/detail?userId=${mockUserId}`);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on API failure', async () => {
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network Error'));

    await expect(GetUserApi(mockUserId)).rejects.toThrow('Network Error');
    expect(axiosInstance.get).toHaveBeenCalledWith(`/user/detail?userId=${mockUserId}`);
  });
});
