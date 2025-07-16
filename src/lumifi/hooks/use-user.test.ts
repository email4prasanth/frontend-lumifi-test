import { setUser } from '@/store/slices';
import { act, renderHook } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { PostLoginApi, PostSelectLoginPracticeAccountApi, PostUserPracticeAccountApi } from '../api';
import { PostResendOtpApi } from '../api/post-resend-otp';
import { PostVerifyOtpApi } from '../api/post-verify-otp';
import type {
  ILoginResponse,
  ILoginUser,
  IPracticeAccountTypePayload,
  IResendOtp,
  IResendOtpResponse,
  ITwoFaResponse,
  IUserPracticeType,
  IUserPracticeTypeResponse,
  IUserResponse,
  IVerifyOtp,
} from '../types/user-login-types';
import { useUserLogin } from './use-user';

// Mock Redux and toast
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn() },
}));

// Mock API modules
vi.mock('../api', () => ({
  PostLoginApi: vi.fn(),
  PostUserPracticeAccountApi: vi.fn(),
  PostSelectLoginPracticeAccountApi: vi.fn(),
}));
vi.mock('../api/post-resend-otp', () => ({
  PostResendOtpApi: vi.fn(),
}));
vi.mock('../api/post-verify-otp', () => ({
  PostVerifyOtpApi: vi.fn(),
}));

describe('useUserLogin', () => {
  const dispatchMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as unknown as Mock).mockReturnValue(dispatchMock);
  });

  // Test: User Login
  it('logs in user successfully', async () => {
    const mockResponse: ILoginResponse = {
      message: 'Login successful',
      loginId: 'login-123',
      userId: 'user-456',
      emailId: 'test@example.com',
      has2fa: true,
      status: 'success',
    };
    (PostLoginApi as unknown as Mock<typeof PostLoginApi>).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.postUserLogin({} as ILoginUser, onComplete);
    });

    expect(result.current.loginResponse).toEqual(mockResponse);
    expect(toast.success).toHaveBeenCalledWith('Login successful');
    expect(dispatchMock).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith({ status: 'success', has2fa: true });
    expect(result.current.isLoginLoading).toBe(false);
  });

  it('handles login error', async () => {
    (PostLoginApi as unknown as Mock<typeof PostLoginApi>).mockRejectedValueOnce(new Error('Authentication failed'));
    const onComplete = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.postUserLogin({} as ILoginUser, onComplete);
    });

    expect(onComplete).toHaveBeenCalledWith({ status: 'failure', has2fa: null });
    expect(result.current.isLoginLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // Test: OTP Verification
  it('verifies OTP successfully', async () => {
    const mockResponse: ITwoFaResponse = {
      message: 'OTP verified',
      status: '',
    };
    (PostVerifyOtpApi as unknown as Mock<typeof PostVerifyOtpApi>).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.VerifyOtp({} as IVerifyOtp, onComplete);
    });

    expect(result.current.twoFaResponse).toEqual(mockResponse);
    expect(toast.success).toHaveBeenCalledWith('OTP verified');
    expect(onComplete).toHaveBeenCalledWith('success');
    expect(result.current.isTwoFaLoading).toBe(false);
  });

  it('handles OTP verification error', async () => {
    (PostVerifyOtpApi as unknown as Mock<typeof PostVerifyOtpApi>).mockRejectedValueOnce(new Error('Invalid OTP'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.VerifyOtp({} as IVerifyOtp, onComplete);
    });

    expect(result.current.isTwoFaLoading).toBe(false);
    expect(onComplete).toHaveBeenCalledWith('failure');
  });

  // Test: Resend OTP
  it('resends OTP successfully', async () => {
    const mockResponse: IResendOtpResponse = {
      message: 'OTP resent',
      status: '',
      otp: '123456',
    };
    (PostResendOtpApi as unknown as Mock<typeof PostResendOtpApi>).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.resendOtp({} as IResendOtp);
    });

    expect(result.current.twoFaResponse).toEqual(mockResponse);
    expect(toast.success).toHaveBeenCalledWith('OTP resent');
    expect(result.current.isResendOtpLoading).toBe(false);
  });

  it('handles resend OTP error', async () => {
    (PostResendOtpApi as unknown as Mock<typeof PostResendOtpApi>).mockRejectedValueOnce(new Error('Resend failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.resendOtp({} as IResendOtp);
    });

    expect(result.current.isResendOtpLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Two-factor authentication failed:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // Test: Practice Account
  it('fetches user practice account list successfully', async () => {
    const mockResponse: IUserPracticeTypeResponse = [
      {
        id: 'acc-123',
        practice_name: '',
      },
    ];
    (PostUserPracticeAccountApi as unknown as Mock<typeof PostUserPracticeAccountApi>).mockResolvedValueOnce(
      mockResponse
    );

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.userPracticeAccountList({} as IUserPracticeType);
    });

    expect(result.current.practiceTypeResponse).toEqual(mockResponse);
    expect(result.current.isPracticeTypeLoading).toBe(false);
  });

  it('handles error in user practice account list', async () => {
    (PostUserPracticeAccountApi as unknown as Mock<typeof PostUserPracticeAccountApi>).mockRejectedValueOnce(
      new Error('Fetch failed')
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.userPracticeAccountList({} as IUserPracticeType);
    });

    expect(result.current.isPracticeTypeLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update user practice type:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // Test: Final Login
  it('fetches user login data successfully', async () => {
    const mockResponse: IUserResponse = {
      status: 'success',
      message: 'Login completed',
    };
    (
      PostSelectLoginPracticeAccountApi as unknown as Mock<typeof PostSelectLoginPracticeAccountApi>
    ).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.fetchUserLoginData({} as IPracticeAccountTypePayload, onComplete);
    });

    expect(dispatchMock).toHaveBeenCalledWith(setUser(mockResponse));
    expect(toast.success).toHaveBeenCalledWith('Login completed');
    expect(onComplete).toHaveBeenCalledWith({ status: 'success', userData: mockResponse });
    expect(result.current.isUserLoginLoading).toBe(false);
  });

  it('handles error in fetchUserLoginData', async () => {
    (
      PostSelectLoginPracticeAccountApi as unknown as Mock<typeof PostSelectLoginPracticeAccountApi>
    ).mockRejectedValueOnce(new Error('Login failed'));
    const onComplete = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.fetchUserLoginData({} as IPracticeAccountTypePayload, onComplete);
    });

    expect(result.current.isUserLoginLoading).toBe(false);
    expect(onComplete).toHaveBeenCalledWith({ status: 'failure' });
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user login data:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
