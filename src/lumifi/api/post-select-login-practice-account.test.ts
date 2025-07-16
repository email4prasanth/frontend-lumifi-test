import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '../api/executer';
import type { IPracticeAccountTypePayload, IUserResponse } from '../types/user-login-types';
import { PostSelectLoginPracticeAccountApi } from './post-auth-completion';

vi.mock('../api/executer', async () => {
  const actual = await vi.importActual('../api/executer');
  return {
    ...actual,
    axiosInstance: {
      post: vi.fn(),
    },
  };
});

describe('PostSelectLoginPracticeAccountApi', () => {
  const mockPayload: IPracticeAccountTypePayload = {
    loginId: 'login-123',
    userId: 'user-456',
    practiceAccountId: 'practice-789',
  };

  const mockResponse: IUserResponse = {
    message: 'Practice account selected',
    status: 'success',
    authToken: 'mock-auth-token',
    refreshToken: 'mock-refresh-token',
    exp: 1712345678,
    userDetails: {
      id: 'user-456',
      readable_id: 'U-001',
      practice_account_id: 'practice-789',
      first_name: 'Alice',
      last_name: 'Smith',
      email_id: 'alice@example.com',
      phone_number: '9876543210',
      role_id: 'role-1',
      role: 'Doctor',
      dea: 'DEA123456',
      license_number: 'LIC987654',
      state_of_issue: 'NY',
      password: 'hashed-password',
      has_2fa: true,
      active_status: true,
      account_verified: true,
      created_by: null,
      updated_by: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: null,
      doctor_email_id: 'alice.doc@example.com',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user response on successful API call', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await PostSelectLoginPracticeAccountApi(mockPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('auth/selectLoginPracticeAccount', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on failed API call', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Invalid practice account'));

    await expect(PostSelectLoginPracticeAccountApi(mockPayload)).rejects.toThrow('Invalid practice account');
    expect(axiosInstance.post).toHaveBeenCalledWith('auth/selectLoginPracticeAccount', mockPayload);
  });
});
