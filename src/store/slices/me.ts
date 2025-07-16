import type { IMeUser } from '@/lumifi/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface MeState {
  details: IMeUser | null;
  isMeLoaded: boolean;
}

const initialState: MeState = {
  details: null,
  isMeLoaded: false,
};

const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    setMeUser(state, action: PayloadAction<IMeUser>) {
      state.details = action.payload;
      state.isMeLoaded = true;
    },
    clearMeUser() {
      return initialState;
    },
  },
});

export const { setMeUser, clearMeUser } = meSlice.actions;
export const meReducer = meSlice.reducer;
export const meUserDetails = (state: MeState) => state.details;
export const isMeLoaded = (state: MeState) => state.isMeLoaded;
