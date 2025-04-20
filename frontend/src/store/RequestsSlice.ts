import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestsAdminFormInputs } from '@src/components/pages/RequestsAdminPage';
import { RequestsClientFormInputs } from '@src/components/pages/RequestsClientPage';
import { sleep } from '@src/lib/Sleep';
import { requests as requestsData } from '@src/model/data.example';
import { Request } from '@src/model/request';
import { RootState } from './Store';

export const updateRequests = createAsyncThunk(
  'requests/updateRequests',
  async (_: unknown, { getState }) => {
    await sleep(1000);

    const { isLoading, requests, ...fields } = (getState() as RootState).requests; // на будущее чтобы не гадать

    return requestsData.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  },
);


export type RequestsState = {
  isLoading: boolean;
  requests?: Request[];
} & ( Partial<RequestsClientFormInputs> | Partial<RequestsAdminFormInputs> );

const initialState: RequestsState = {
  isLoading: false,
};

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    updateFields: (state, action: PayloadAction<Partial<RequestsClientFormInputs> | Partial<RequestsAdminFormInputs>>) => {
      Object.assign(state, action.payload);
    },
    reset: state => initialState,
  },
  extraReducers: builder => {
    builder.addCase(updateRequests.pending, state => {
      state.isLoading = true;
    }).addCase(updateRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.requests = action.payload;
    }).addCase(updateRequests.rejected, (state) => {
      state.isLoading = false;
    })
  },
  selectors: {
    selectFields: state => {
      const { isLoading, requests, ...fields } = state;
      return fields;
    },
    selectRequests: state => state.requests,
    selectIsLoading: state => state.isLoading,
  },
});

export const { updateFields, reset } = requestsSlice.actions;
export const { selectFields, selectRequests, selectIsLoading } = requestsSlice.selectors;
export default requestsSlice.reducer;
