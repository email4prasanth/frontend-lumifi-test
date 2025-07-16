import { describe, expect, it, vi, type Mock } from 'vitest';
import { axiosInstance } from './executer';
import { PostUserListApi } from './post-user-list';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('PostUserListApi', () => {
  const mockPayload = {
    page: 1,
    pageSize: 10,
    practiceAccountId: 'practice-1',
    limit: 10,
    role: 'User',
  };
  const mockResponse = { users: [], total: 0 };

  it('should post user list payload and return response', async () => {
    (axiosInstance.post as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostUserListApi(mockPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('/user/list', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when axiosInstance.post fails', async () => {
    (axiosInstance.post as Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(PostUserListApi(mockPayload)).rejects.toThrow('Network Error');
  });
});
