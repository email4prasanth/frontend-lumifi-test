import { describe, expect, it, vi, type Mock } from 'vitest';
import { axiosInstance } from './executer';
import { PostUserPracticeAccountApi } from './post-user-practice-account';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('PostUserPracticeAccountApi', () => {
  const mockPayload = { userId: '123', practiceType: 'test', loginId: 'login-001', emailId: 'user@example.com' };
  const mockResponse = { success: true, data: { id: 'abc' } };

  it('should post user practice account payload and return response', async () => {
    (axiosInstance.post as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostUserPracticeAccountApi(mockPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/userPracticeAccount', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when axiosInstance.post fails', async () => {
    (axiosInstance.post as Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(PostUserPracticeAccountApi(mockPayload)).rejects.toThrow('Network Error');
  });
});
