import { Button, Paper, Stack, Typography, Container } from '@mui/material';
import { ProductsTable } from '@src/components/ui/ProductsTable';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { selectAdminForm, selectClientForm, updateAdminFields, updateClientFields } from '@src/store/ProductsSlice';
import { useNavigate } from 'react-router-dom';
import { ClientFilters, ClientFiltersFormInputs } from '@src/components/ui/ClientFilters';
import { LogoutButton } from '@src/components/ui/buttons/LogoutButton';
import { CreateProductButton } from '@src/components/ui/buttons/CreateProductButton';
import { selectIsAdmin } from '@src/store/UserSlice';
import { AdminFilters, AdminFiltersFormInputs } from '@src/components/ui/AdminFilters';
import { BackupExportButton } from '@src/components/ui/buttons/BackupExportButton';
import { BackupImportButton } from '@src/components/ui/buttons/BackupImportButton';
import { useCallback } from 'react';
import { ApiService } from '@src/api';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAdmin = useAppSelector(selectIsAdmin);
  const adminFilterValues = useAppSelector(selectAdminForm);
  const clientFilterValues = useAppSelector(selectClientForm);

  const getProductsWithAdminFilters = useCallback(async (page: number, pageSize: number) => {
    const {
      from,
      to,
      status,
      category,
      me,
      ...restFilters
    } = adminFilterValues;

    let products = await ApiService.apiRequestsList({
      from: from?.format('YYYY-MM-DD'),
      to: to?.format('YYYY-MM-DD'),
      status: status === 'any' ? undefined : status,
      category: category === 'any' ? undefined : category,
      me: me === true ? true : undefined,
      ...restFilters,
    });

    const total = products.length;
    products = products.slice(page*pageSize, (page + 1)*pageSize);
    
    return { total, products };
  }, [adminFilterValues]);

  const getProductsWithClientFilters = useCallback(async (page: number, pageSize: number) => {
    const {
      from,
      to,
      status,
      category,
      sort,
      ...restFilters
    } = clientFilterValues;

    let products = await ApiService.apiRequestsList({
      from: from?.format('YYYY-MM-DD'),
      to: to?.format('YYYY-MM-DD'),
      status: status === 'any' ? undefined : status,
      category: category === 'any' ? undefined : category,
      sort: sort === 'any' ? undefined : sort,
      ...restFilters,
    });

    const total = products.length;
    products = products.slice(page*pageSize, (page + 1)*pageSize);
    
    return { total, products };
  }, [clientFilterValues]);

  const onAdminSubmit = (data: AdminFiltersFormInputs) => {
    dispatch(updateAdminFields(data));
  };

  const onClientSubmit = (data: ClientFiltersFormInputs) => {
    dispatch(updateClientFields(data));
  };

  return (
    <Container maxWidth='lg'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack gap={1}>
          <Typography variant='h4'>Список заявок</Typography>

          <Stack direction='row' gap={1}>
            <Button variant='contained' onClick={() => navigate('/profile')}>Перейти в профиль</Button>
            { isAdmin
              ? <>
                <BackupExportButton />
                <BackupImportButton />
                <Button variant='contained' onClick={() => {}}>Статистика</Button>
              </>
              : <CreateProductButton />
            }
            <LogoutButton />
          </Stack>

          { isAdmin 
            ? <AdminFilters defaultValues={adminFilterValues} onSubmit={onAdminSubmit} />
            : <ClientFilters defaultValues={clientFilterValues} onSubmit={onClientSubmit} />
          }

          <ProductsTable pageSize={10} getData={isAdmin ? getProductsWithAdminFilters : getProductsWithClientFilters}/>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProductsPage;
