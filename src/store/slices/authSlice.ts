import type { IUserDetails, IUserResponse } from '@/lumifi/types/user-login-types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  authToken: string;
  refreshToken: string;
  exp: number;
  userDetails: IUserDetails | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  authToken: '',
  refreshToken: '',
  exp: 0,
  userDetails: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUserResponse>) {
      if (action.payload.status === 'success') {
        state.authToken = action.payload.authToken || '';
        state.refreshToken = action.payload.refreshToken || '';
        state.exp = action.payload.exp || 0;
        state.userDetails = action.payload.userDetails || null;
        state.isAuthenticated = true;
      }
    },
    refreshAuthToken(state, action: PayloadAction<{ authToken: string; exp: number }>) {
      state.authToken = action.payload.authToken;
      state.exp = action.payload.exp;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const userDetails = (state: AuthState) => state.userDetails;
export const { setUser, refreshAuthToken, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
