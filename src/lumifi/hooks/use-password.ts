import { useState } from 'react';
import { toast } from 'react-toastify';
import { GetResetPasswordLinkApi, PostResetPasswordApi, PostSetPasswordApi } from '../api';
import type { IResetPasswordPayload, ISetPasswordPayload } from '../types';

export const usePassword = () => {
  // Set password (for first-time users)
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const setPassword = async (payload: ISetPasswordPayload, onComplete: (status: string) => void) => {
    setIsSettingPassword(true);
    PostSetPasswordApi(payload)
      .then((res) => {
        toast.success(res.message);
        setIsSettingPassword(false);
        onComplete('success');
      })
      .catch((error) => {
        console.error('Error Creating Patient: ', error);
        onComplete('Failure');
        setIsSettingPassword(false);
      });
  };

  // Send Reset password Link
  const [isSendingResetLink, setIsSendingResetLink] = useState(false);

  const sendResetPasswordLink = (emailId: string) => {
    setIsSendingResetLink(true);
    GetResetPasswordLinkApi(emailId)
      .then((res) => {
        toast.success(res.message);
        setIsSendingResetLink(false);
      })
      .catch((error) => {
        console.error('Error Sending Reset Password Link: ', error);
        setIsSendingResetLink(false);
      });
  };

  // Reset password
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const resetPassword = (resetPasswordPayload: IResetPasswordPayload, onComplete: (status: string) => void) => {
    setIsResettingPassword(true);
    PostResetPasswordApi(resetPasswordPayload)
      .then((res) => {
        toast.success(res.message);
        setIsResettingPassword(false);
        onComplete('success');
      })
      .catch((error) => {
        console.error('Error Resetting Password: ', error);
        onComplete('Failure');
        setIsResettingPassword(false);
      });
  };

  return {
    // Set password (for first-time users)
    isSettingPassword,
    setPassword,

    // Send Reset password Link
    isSendingResetLink,
    sendResetPasswordLink,

    // Reset password
    isResettingPassword,
    resetPassword,
  };
};
