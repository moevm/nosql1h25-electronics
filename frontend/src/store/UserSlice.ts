import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthService, UserResponse, ApiError } from '@src/api';
import { sleep } from '@src/lib/Sleep';
import { RootState } from './Store';
import dayjs from 'dayjs';

export const initLogin = createAsyncThunk(
  'user/initLogin',
  async (_: unknown, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue(null);

    try {
      const user = await AuthService.authMeRetrieve();

      return { token, user };
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const login = createAsyncThunk(
  'user/login',
  async ({ login, password }: { login: string, password: string }, { rejectWithValue }) => {

    try {
      const { token } = await AuthService.authLoginCreate({ requestBody: { login, password }});
      localStorage.setItem('token', token);
      const user = await AuthService.authMeRetrieve();

      return { token, user };
    } catch (e) {
      localStorage.clear();
      if (!(e instanceof ApiError)) return rejectWithValue('Неизвестная ошибка');

      if (e.body?.details === 'Invalid input') return rejectWithValue('Неправильный логин или пароль');
      
      return rejectWithValue('Неизвестная ошибка');
    }
  },
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    try {
      await AuthService.authLogoutCreate();
    } finally {
      localStorage.clear();
    }
  },
);

export const editUser = createAsyncThunk(
  'user/editUser',
  async ({ fullname, phone }: { fullname: string, phone: string }, { getState, rejectWithValue }) => {
    // TODO: после генерации использовать нормальный api
    await sleep(1000);
    
    const oldUser = (getState() as RootState).user.user!;

    // return rejectWithValue('Неизвестная ошибка');

    try {
      return {
        ...oldUser,
        fullname,
        phone,
        edit_date: dayjs().toISOString(),
      } satisfies UserResponse;
    } catch (e) {
      if (!(e instanceof ApiError)) return rejectWithValue('Неизвестная ошибка');
      return rejectWithValue('Неизвестная ошибка');
    }
  },
);

export interface UserState {
  user?: UserResponse;
  token?: string;
  error?: string;
  isAuthorizing: boolean;
  isLoggingOut: boolean;
  isInit: boolean;
}

const initialState: UserState = {
  isAuthorizing: false,
  isLoggingOut: false,
  isInit: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.error = undefined;
      state.isAuthorizing = true;
    }).addCase(login.fulfilled, (state, action) => {
      state.error = undefined;
      state.isAuthorizing = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    }).addCase(login.rejected, (state, action) => {
      state.error = action.payload as string;
      state.isAuthorizing = false;
    })
    
    .addCase(logout.pending, state => {
      state.isLoggingOut = true;
    }).addCase(logout.fulfilled, state => {
      state.user = undefined;
      state.token = undefined;
      state.isLoggingOut = false;
    }).addCase(logout.rejected, state => {
      state.user = undefined;
      state.token = undefined;
      state.isLoggingOut = false;
    })
    
    .addCase(initLogin.pending, state => {
      state.isAuthorizing = true;
    }).addCase(initLogin.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInit = false;
      state.isAuthorizing = false;
    }).addCase(initLogin.rejected, state => {
      state.isInit = false;
      state.isAuthorizing = false;
    })
    
    .addCase(editUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
  selectors: {
    selectIsAdmin: state => state.user?.role === 'admin',
    selectIsClient: state => state.user?.role === 'client',
    selectIsAuthorized: state => !!state.user,
    selectIsAuthorizing: state => state.isAuthorizing,
    selectIsLoggingOut: state => state.isLoggingOut,
    selectIsInitialAuthorizing: state => state.isInit && state.isAuthorizing,

    selectUser: state => state.user,
    selectToken: state => state.token,
  },
});

export const { selectIsAdmin, selectIsClient, selectIsAuthorized, selectIsAuthorizing, selectIsLoggingOut, selectIsInitialAuthorizing, selectUser, selectToken } = userSlice.selectors;
export default userSlice.reducer;
