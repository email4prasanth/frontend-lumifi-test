import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '../api/executer';
import type { IResendOtp, IResendOtpResponse } from '../types/user-login-types';
import { PostResendOtpApi } from './post-resend-otp';

vi.mock('../api/executer', async () => {
  const actual = await vi.importActual('../api/executer');
  return {
    ...actual,
    axiosInstance: {
      post: vi.fn(),
    },
  };
});

describe('PostResendOtpApi', () => {
  const mockPayload: IResendOtp = {
    loginId: 'login-123',
    userId: 'user-456',
  };

  const mockResponse: IResendOtpResponse = {
    message: 'OTP sent successfully',
    status: 'success',
    otp: '987654',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return OTP response on success', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await PostResendOtpApi(mockPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/resendOtp', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on failure', async () => {
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('OTP resend failed'));

    await expect(PostResendOtpApi(mockPayload)).rejects.toThrow('OTP resend failed');
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/resendOtp', mockPayload);
  });
});
