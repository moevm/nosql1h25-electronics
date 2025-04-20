import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sleep } from '@src/lib/Sleep';
import { admin, client } from '@src/model/data.example';
import { User } from '@src/model/user';

const login = createAsyncThunk(
  'user/login',
  async ({ login, password }: { login: string, password: string }, { rejectWithValue }) => {
    await sleep(1000);

    if (login === 'client' && password === 'password') return { token: '123', user: client };
    if (login === 'admin' && password === 'password') return { token: '123', user: admin };

    return rejectWithValue('Неправильный логин или пароль');
  },
);

const logout = createAsyncThunk(
  'user/logout',
  () => sleep(1000),
);

export interface UserState {
  user?: User;
  token?: string;
  error?: string;
  authorizing: boolean;
}

const initialState: UserState = {
  authorizing: false,
};

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.error = undefined;
      state.authorizing = true;
    }).addCase(login.fulfilled, (state, action) => {
      state.error = undefined;
      state.authorizing = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    }).addCase(login.rejected, (state, action) => {
      state.error = action.payload as string;
      state.authorizing = false;
    }).addCase(logout.fulfilled, state => {
      state.user = undefined;
      state.token = undefined;
    });
  },
  selectors: {
    selectIsAdmin: state => state.user?.role === 'admin',
    selectIsClient: state => state.user?.role === 'client',
    selectIsAuthorized: state => !!state.user,

    selectUser: state => state.user,
    selectToken: state => state.token,
  },
});

export const { selectIsAdmin, selectIsClient, selectIsAuthorized, selectUser, selectToken } = counterSlice.selectors;
export default counterSlice.reducer;
