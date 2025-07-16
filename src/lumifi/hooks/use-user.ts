import { setLoginData, setUser } from '@/store/slices';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { PostAuthCompletionApi, PostLoginApi, PostUserPracticeAccountApi } from '../api';
import { PostResendOtpApi } from '../api/post-resend-otp';
import { PostVerifyOtpApi } from '../api/post-verify-otp';
import type {
  ILoginResponse,
  ILoginUser,
  IPracticeAccountTypePayload,
  IResendOtp,
  ISelectUserPracticeRequest,
  ITwoFaResponse,
  IUserPracticeTypeResponse,
  IUserResponse,
  IVerifyOtp,
} from '../types/user-login-types';

export const useUserLogin = () => {
  // Redux
  const dispatch = useDispatch();

  // User Login
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginResponse, setLoginResponse] = useState<ILoginResponse | null>(null);

  const postUserLogin = (
    loginData: ILoginUser,
    onComplete: ({ status, response }: { status: string; response: ILoginResponse | null }) => void
  ) => {
    setIsLoginLoading(true);
    PostLoginApi(loginData)
      .then((res) => {
        toast.success(res.message || 'Login successful');
        setLoginResponse(res);
        dispatch(
          setLoginData({
            loginId: res.loginId ?? '',
            emailId: res.emailId ?? '',
            userPracticeExistance: res.practiceAccountList ?? [],
          })
        );
        onComplete({ status: 'success', response: res });
      })
      .catch((err) => {
        onComplete({ status: 'failure', response: null });
        console.error('Login failed:', err);
        setIsLoginLoading(false);
      })
      .finally(() => {
        setIsLoginLoading(false);
      });
  };

  // Two-Factor Authentication
  const [isTwoFaLoading, setIsTwoFaLoading] = useState<boolean>(false);
  const [twoFaResponse, setTwoFaResponse] = useState<ITwoFaResponse | null>(null);

  const VerifyOtp = (verifyOtp: IVerifyOtp, onOtpVerificationComplete: (status: string) => void) => {
    setIsTwoFaLoading(true);
    PostVerifyOtpApi(verifyOtp)
      .then((res) => {
        toast.success(res.message || 'OTP verification successful');
        setTwoFaResponse(res);
        onOtpVerificationComplete('success');
      })
      .catch(() => {
        setIsTwoFaLoading(false);
        onOtpVerificationComplete('failure');
      })
      .finally(() => {
        setIsTwoFaLoading(false);
      });
  };

  // Resend Otp

  const [isResendOtpLoading, setIsResendOtpLoading] = useState<boolean>(false);

  const resendOtp = (resendOtp: IResendOtp) => {
    setIsResendOtpLoading(true);
    PostResendOtpApi(resendOtp)
      .then((res) => {
        toast.success(res.message || 'OTP resent successfully');
        setTwoFaResponse(res);
      })
      .catch((err) => {
        console.error('Two-factor authentication failed:', err);
        setIsResendOtpLoading(false);
      })
      .finally(() => {
        setIsResendOtpLoading(false);
      });
  };

  // Select Practice
  const [isSelectPracticeLoading, setIsSelectPracticeLoading] = useState<boolean>(false);

  const selectUserPracticeAccount = (
    userPracticeType: ISelectUserPracticeRequest,
    onComplete: ({
      status,
      response,
      practiceAccountId,
    }: {
      status: string;
      response: IUserPracticeTypeResponse | null;
      practiceAccountId: string | null;
    }) => void
  ) => {
    setIsSelectPracticeLoading(true);
    PostUserPracticeAccountApi(userPracticeType)
      .then((res) => {
        onComplete({ status: 'success', response: res, practiceAccountId: userPracticeType.practiceAccountId });
      })
      .catch((err) => {
        onComplete({ status: 'failure', response: null, practiceAccountId: null });
        console.error('Failed to update user practice type:', err);
        setIsSelectPracticeLoading(false);
      })
      .finally(() => {
        setIsSelectPracticeLoading(false);
      });
  };

  // Final Step For Practice Login
  const [isAuthCompletionLoading, setIsAuthCompletionLoading] = useState<boolean>(false);

  const authCompletion = (
    practiceAccType: IPracticeAccountTypePayload,
    onComplete: ({ status, userData }: { status: string; userData?: IUserResponse }) => void
  ) => {
    setIsAuthCompletionLoading(true);
    PostAuthCompletionApi(practiceAccType)
      .then((res) => {
        if (res.status === 'success') {
          dispatch(setUser(res));
        }
        toast.success(res.message || 'Login Successful');
        onComplete({ status: 'success', userData: res });
      })
      .catch((err) => {
        console.error('Failed to fetch user login data:', err);
        setIsAuthCompletionLoading(false);
        onComplete({ status: 'failure' });
      })
      .finally(() => {
        setIsAuthCompletionLoading(false);
      });
  };

  return {
    // User Login
    isLoginLoading,
    loginResponse,
    postUserLogin,

    // Two-Factor Authentication
    isTwoFaLoading,
    twoFaResponse,
    VerifyOtp,

    //Select User Practice
    isSelectPracticeLoading,
    selectUserPracticeAccount,

    // Logged User Data
    isAuthCompletionLoading,
    authCompletion,

    //ResendOtp
    isResendOtpLoading,
    resendOtp,
  };
};
