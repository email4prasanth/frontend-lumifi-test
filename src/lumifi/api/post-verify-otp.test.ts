import { describe, expect, it, vi, type Mock } from 'vitest';
import { axiosInstance } from './executer';
import { PostVerifyOtpApi } from './post-verify-otp';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('PostVerifyOtpApi', () => {
  const mockPayload = { otp: '123456', userId: 'user-1', loginId: 'login-1' };
  const mockResponse = { success: true, token: 'jwt-token' };

  it('should post verify otp payload and return response', async () => {
    (axiosInstance.post as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostVerifyOtpApi(mockPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/verifyOtp', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when axiosInstance.post fails', async () => {
    (axiosInstance.post as Mock).mockRejectedValueOnce(new Error('Invalid OTP'));

    await expect(PostVerifyOtpApi(mockPayload)).rejects.toThrow('Invalid OTP');
  });
});
