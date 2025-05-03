import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminFiltersFormInputs } from '@src/components/ui/AdminFilters';
import { ClientFiltersFormInputs } from '@src/components/ui/ClientFilters';
import { RootState } from './Store';
import { ApiError, ApiService, ProductRequest } from '@src/api';

export const updateProducts = createAsyncThunk(
  'products/updateProducts',
  async (_: unknown, { getState, rejectWithValue }) => {
    const { clientForm, adminForm } = (getState() as RootState).products;
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

export type ProductsState = {
  isLoading: boolean;
  products?: ProductRequest[];
  clientForm: Partial<ClientFiltersFormInputs>;
  adminForm: Partial<AdminFiltersFormInputs>;
};

const initialState: ProductsState = {
  isLoading: false,
  clientForm: {},
  adminForm: {},
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateClientFields: (state, action: PayloadAction<Partial<ClientFiltersFormInputs>>) => {
      Object.assign(state.clientForm, action.payload);
    },
    updateAdminFields: (state, action: PayloadAction<Partial<AdminFiltersFormInputs>>) => {
      Object.assign(state.adminForm, action.payload);
    },
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(updateProducts.pending, state => {
      state.isLoading = true;
    }).addCase(updateProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    }).addCase(updateProducts.rejected, (state) => {
      state.isLoading = false;
    })
  },
  selectors: {
    selectAdminForm: state => state.adminForm,
    selectClientForm: state => state.clientForm,
    selectProducts: state => state.products,
    selectIsLoading: state => state.isLoading,
  },
});

export const { updateClientFields, updateAdminFields, reset } = productsSlice.actions;
export const { selectAdminForm, selectClientForm, selectProducts, selectIsLoading } = productsSlice.selectors;
export default productsSlice.reducer;
