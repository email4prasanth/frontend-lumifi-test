import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAuthRefreshResponse, IAuthRefreshTokenPayload } from '../types/user-login-types';
import { PostAuthRefreshTokenApi } from './post-auth-refresh-token';

vi.mock('axios');

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

describe('PostAuthRefreshTokenApi', () => {
  const mockPayload: IAuthRefreshTokenPayload = {
    refreshToken: 'mock-refresh-token',
    loginId: 'mock-login-id',
    userId: 'mock-user-id',
  };

  const mockResponse: IAuthRefreshResponse = {
    message: 'Token refreshed successfully',
    status: 'success',
    statusCode: 200,
    authToken: 'new-token-123',
    exp: 1712345678,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return refresh token response on success', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ data: mockResponse });

    const result = await PostAuthRefreshTokenApi(mockPayload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
      mockPayload
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on failure', async () => {
    mockedAxios.post = vi.fn().mockRejectedValue(new Error('Refresh failed'));

    await expect(PostAuthRefreshTokenApi(mockPayload)).rejects.toThrow('Refresh failed');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
      mockPayload
    );
  });
});
