import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface IUserPracticeExistence {
  id: string;
  practice_name: string;
}

interface ILoginAuthState {
  loginId: string;
  emailId: string;
  userId: string;
  has2fa: boolean;
  practiceAccountId: string;
  userPracticeExistance: IUserPracticeExistence[];
}

const initialState: ILoginAuthState = {
  loginId: '',
  emailId: '',
  userId: '',
  userPracticeExistance: [],
  has2fa: false,
  practiceAccountId: '',
};

const loginAuthSlice = createSlice({
  name: 'loginAuth',
  initialState,
  reducers: {
    setLoginData(state, action: PayloadAction<Pick<ILoginAuthState, 'loginId' | 'emailId' | 'userPracticeExistance'>>) {
      state.loginId = action.payload.loginId;
      state.emailId = action.payload.emailId;
      state.userPracticeExistance = action.payload.userPracticeExistance;
    },
    setAccountDetail(state, action: PayloadAction<Pick<ILoginAuthState, 'userId' | 'has2fa' | 'practiceAccountId'>>) {
      state.userId = action.payload.userId;
      state.has2fa = action.payload.has2fa;
      state.practiceAccountId = action.payload.practiceAccountId;
    },
    clearLoginData() {
      return {
        ...initialState,
      };
    },
  },
});

export const { setLoginData, clearLoginData, setAccountDetail } = loginAuthSlice.actions;
export const loginAuthReducer = loginAuthSlice.reducer;
