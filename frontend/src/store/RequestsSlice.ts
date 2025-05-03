import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminFiltersFormInputs } from '@src/components/ui/AdminFilters';
import { RequestsClientFormInputs } from '@src/components/pages/RequestsClientPage';
import { RootState } from './Store';
import { ApiError, ApiService, ProductRequest } from '@src/api';

export const updateRequests = createAsyncThunk(
  'requests/updateRequests',
  async (_: unknown, { getState, rejectWithValue }) => {
    const { clientForm, adminForm } = (getState() as RootState).requests;
    const modifiedAdminForm = { ...adminForm };
    if (adminForm.me === false) modifiedAdminForm.me = undefined; 

    let targetForm;

    if ((getState() as RootState).user.user!.role === 'admin') targetForm = modifiedAdminForm;
    else targetForm = clientForm;
    
    const { from, to, status, category, ...restFields } = targetForm;

    try {
      return await ApiService.apiRequestsList({ 
        from: from?.format('YYYY-MM-DD'), 
        to: to?.format('YYYY-MM-DD'),
        status: status === 'any' ? undefined : status,
        category: category === 'any' ? undefined : category,
        ...restFields,
      });
    } catch (e) {
      if (e instanceof ApiError) console.log(e);
      return rejectWithValue(null);
    }
  },
);

export type RequestsState = {
  isLoading: boolean;
  requests?: ProductRequest[];
  clientForm: Partial<RequestsClientFormInputs>;
  adminForm: Partial<AdminFiltersFormInputs>;
};

const initialState: RequestsState = {
  isLoading: false,
  clientForm: {},
  adminForm: {},
};

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    updateClientFields: (state, action: PayloadAction<Partial<RequestsClientFormInputs>>) => {
      Object.assign(state.clientForm, action.payload);
    },
    updateAdminFields: (state, action: PayloadAction<Partial<AdminFiltersFormInputs>>) => {
      Object.assign(state.adminForm, action.payload);
    },
    reset: () => initialState,
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
    selectAdminForm: state => state.adminForm,
    selectClientForm: state => state.clientForm,
    selectRequests: state => state.requests,
    selectIsLoading: state => state.isLoading,
  },
});

export const { updateClientFields, updateAdminFields, reset } = requestsSlice.actions;
export const { selectAdminForm, selectClientForm, selectRequests, selectIsLoading } = requestsSlice.selectors;
export default requestsSlice.reducer;
