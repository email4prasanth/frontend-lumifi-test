import { beforeEach, describe, expect, it, vi } from 'vitest';

import { axiosInstance } from '../api/executer';
import type { ILoginResponse, ILoginUser } from '../types/user-login-types';
import { PostLoginApi } from './post-login';

vi.mock('../api/executer', async () => {
  const actual = await vi.importActual('../api/executer');
  return {
    ...actual,
    axiosInstance: {
      post: vi.fn(),
    },
  };
});

describe('PostLoginApi', () => {
  const mockLoginPayload: ILoginUser = {
    emailId: 'john.doe@example.com',
    password: 'password123',
  };

  const mockResponse: ILoginResponse = {
    message: 'Login successful',
    emailId: 'john.doe@example.com',
    status: 'success',
    loginId: 'login-id-123',
    userId: 'user-id-456',
    has2fa: true,
    otp: '123456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return login response on success', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await PostLoginApi(mockLoginPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', mockLoginPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on failure', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Invalid credentials'));

    await expect(PostLoginApi(mockLoginPayload)).rejects.toThrow('Invalid credentials');
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', mockLoginPayload);
  });
});
