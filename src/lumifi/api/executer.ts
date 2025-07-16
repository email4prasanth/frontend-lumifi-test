import { ApiErrorHandler } from '@/lib/utils';
import { clearUser, refreshAuthToken } from '@/store/slices';
import { store } from '@/store/store';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { PostAuthRefreshTokenApi } from './post-auth-refresh-token';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

console.log(localStorage.getItem('userIp'));
const ip = localStorage.getItem('userIp');

export const isTokenExpired = (exp: number): boolean => {
  const expiryTime = new Date(exp * 1000);
  return new Date() >= expiryTime;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const auth = state.auth;
    const userAuth = state.loginAuth;

    let token = auth.authToken;
    const exp = auth.exp;
    const refreshToken = auth.refreshToken;
    if (token && exp && isTokenExpired(exp)) {
      if (refreshToken && userAuth.loginId && userAuth.userId) {
        try {
          const payload = {
            loginId: userAuth.loginId,
            userId: userAuth.userId,
            refreshToken: refreshToken,
          };
          const refreshTokenData = await PostAuthRefreshTokenApi(payload);

          if (refreshTokenData.status === 'success' && refreshTokenData.authToken && refreshTokenData.exp) {
            store.dispatch(
              refreshAuthToken({
                authToken: refreshTokenData.authToken as string,
                exp: refreshTokenData.exp as number,
              })
            );
            token = refreshTokenData.authToken as string;
          } else {
            store.dispatch(clearUser());
            window.location.href = '/login';
            return Promise.reject('Refresh failed');
          }
        } catch (error) {
          console.error('Refresh token failed', error);
          store.dispatch(clearUser());
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        store.dispatch(clearUser());
        window.location.href = '/login';
        return Promise.reject('Missing refresh token or user identifiers');
      }
    }
    // Attach token and custom headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Practice-Id'] = auth.userDetails?.practice_account_id ?? '';
      config.headers['User-Id'] = userAuth.userId ?? '';
      config.headers['Login-Id'] = userAuth.loginId ?? '';
    }

    config.headers['Source-Ip'] = ip || '';

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Axios response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => ApiErrorHandler.handle(error) // Centralized error handling
);
