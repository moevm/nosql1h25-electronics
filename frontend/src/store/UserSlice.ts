import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sleep } from '@src/lib/Sleep';
import { admin, client } from '@src/model/data.example';
import { User } from '@src/model/user';

export const initLogin = createAsyncThunk(
  'user/initLogin',
  async (_: unknown, { rejectWithValue }) => {
    await sleep(1000);

    const token = localStorage.getItem('token');
    if (token) return { token, user: localStorage.getItem('role') === 'admin' ? admin : client };

    return rejectWithValue(null);
  },
);

export const login = createAsyncThunk(
  'user/login',
  async ({ login, password }: { login: string, password: string }, { rejectWithValue }) => {
    await sleep(1000);

    if (login === 'client' && password === 'password') {
      localStorage.setItem('token', '123');
      localStorage.setItem('role', 'client'); // пока нет нормального механизма авторизации сделано так, потом этот параметр снесется
      return { token: '123', user: client };
    }
    if (login === 'admin' && password === 'password') { 
      localStorage.setItem('token', '123');
      localStorage.setItem('role', 'admin');
      return { token: '123', user: admin }; 
    }

    return rejectWithValue('Неправильный логин или пароль');
  },
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    await sleep(1000)
    localStorage.clear();
  },
);

export interface UserState {
  user?: User;
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

export const counterSlice = createSlice({
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

export const { selectIsAdmin, selectIsClient, selectIsAuthorized, selectIsAuthorizing, selectIsLoggingOut, selectIsInitialAuthorizing, selectUser, selectToken } = counterSlice.selectors;
export default counterSlice.reducer;
