import axios from 'axios';
import type { IAuthRefreshResponse, IAuthRefreshTokenPayload } from '../types/user-login-types';

const API_ENDPOINT = '/auth/refreshToken';

export const PostAuthRefreshTokenApi = async (refreshTokenPayload: IAuthRefreshTokenPayload) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINT}`, refreshTokenPayload);
    // const response = await axiosInstance.post(API_ENDPOINT, refreshTokenPayload);
    return response.data as unknown as IAuthRefreshResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
