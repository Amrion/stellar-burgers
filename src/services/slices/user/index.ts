import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../../utils/cookie';

export type UserState = {
  user: TUser | null;
};

const initialState: UserState = {
  user: null
};

export const registerUserThunk = createAsyncThunk(
  `user/register`,
  async (data: TRegisterData) => {
    const result = await registerUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

export const loginUserThunk = createAsyncThunk(
  `user/login`,
  async (data: TLoginData) => {
    const result = await loginUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

export const getUserThunk = createAsyncThunk(`user/login`, async () => {
  const result = await getUserApi();
  return result.user;
});

export const updateUserThunk = createAsyncThunk(
  `user/update`,
  async (user: Partial<TRegisterData>) => {
    const result = await updateUserApi(user);
    return result.user;
  }
);

export const logoutUserThunk = createAsyncThunk(
  `user/logout`,
  async (_, { dispatch }) => {
    const result = await logoutApi();
    if (result.success) {
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    isUserAuth: (sliceState) => !!sliceState.user
  },
  reducers: {
    userLogout: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { selectUser, isUserAuth } = userSlice.selectors;

export const { userLogout } = userSlice.actions;

export default userSlice.reducer;
