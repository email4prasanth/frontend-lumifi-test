import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { authReducer, loginAuthReducer } from '../slices';

import { meReducer } from '../slices/me';

const appReducer = combineReducers({
  auth: authReducer,
  loginAuth: loginAuthReducer,
  me: meReducer,
});

// Custom root reducer to clear all state on logout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === 'auth/clearUser') {
    storage.removeItem('persist:root'); // Optional: manually clear localStorage
    return appReducer(undefined, action); // Reset Redux state
  }
  return appReducer(state, action);
};

export type RootReducerType = ReturnType<typeof appReducer>;
export default rootReducer;
