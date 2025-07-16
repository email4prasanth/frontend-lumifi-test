import { beforeEach, describe, expect, it, vi } from 'vitest';

import { axiosInstance } from '../api/executer';
import type { IMeResponse, IMeUserPayload } from '../types';
import { PostMeApi } from './post-me';

vi.mock('../api/executer', async () => {
  const actual = await vi.importActual('../api/executer');
  return {
    ...actual,
    axiosInstance: {
      post: vi.fn(),
    },
  };
});

describe('PostMeApi', () => {
  const mockPayload: IMeUserPayload = {
    userId: 'user-123',
    practiceAccountId: 'practice-456',
  };

  const mockResponse: IMeResponse = {
    message: 'User details fetched successfully',
    status: 'success',
    userDetails: {
      id: 'user-123',
      first_name: 'John',
      last_name: 'Doe',
      email_id: 'john.doe@example.com',
      // other fields are omitted as `Partial<IMeUser>`
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user details on successful API call', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await PostMeApi(mockPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/me', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on API failure', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Unauthorized'));

    await expect(PostMeApi(mockPayload)).rejects.toThrow('Unauthorized');
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/me', mockPayload);
  });
});
