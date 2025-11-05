import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { RootState } from '../store';

interface TAuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  errors: string | null;
}

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  errors: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: Omit<TRegisterData, 'name'>,
    { rejectWithValue }
  ) => {
    try {
      const data = await loginUserApi({ email, password });
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error: any) {
      // Используем rejectWithValue для передачи ошибки
      return rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi({ email, password, name });
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error: any) {
      // Используем rejectWithValue для передачи ошибки
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgot-password',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await forgotPasswordApi({ email });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка восстановления пароля');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const res = await resetPasswordApi(data);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка сброса пароля');
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/get-user',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка получения пользователя');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/update-user',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(user);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка обновления пользователя');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка выхода');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.errors = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = (action.payload as string) || 'Ошибка регистрации';
      })
      // Логин
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = (action.payload as string) || 'Ошибка авторизации';
      })
      // Выход
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.errors = action.payload as string;
      })
      // Получение пользователя
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.errors = action.payload as string;
      })
      // Обновление пользователя
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.errors = action.payload as string;
      });
  }
});

export const { setAuthChecked, clearError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.errors;

export const authReducer = authSlice.reducer;
