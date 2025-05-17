import { Button, Paper, Stack, Typography, Container, CircularProgress, Box } from '@mui/material';
import { ProductsTable } from '@src/components/ui/ProductsTable';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { selectAdminForm, selectClientForm, selectIsLoading, selectProducts, updateAdminFields, updateClientFields, updateProducts } from '@src/store/ProductsSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientFilters, ClientFiltersFormInputs } from '@src/components/ui/ClientFilters';
import { LogoutButton } from '@src/components/ui/buttons/LogoutButton';
import { CreateProductButton } from '@src/components/ui/buttons/CreateProductButton';
import { selectIsAdmin } from '@src/store/UserSlice';
import { AdminFilters, AdminFiltersFormInputs } from '@src/components/ui/AdminFilters';
import { BackupExportButton } from '@src/components/ui/buttons/BackupExportButton';
import { BackupImportButton } from '@src/components/ui/buttons/BackupImportButton';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isProductsLoading = useAppSelector(selectIsLoading);
  const productsData = useAppSelector(selectProducts);
  const isAdmin = useAppSelector(selectIsAdmin);
  const adminFilterValues = useAppSelector(selectAdminForm);
  const clientFilterValues = useAppSelector(selectClientForm);

  useEffect(() => {
    dispatch(updateProducts(null));
  }, []);

  const onAdminSubmit = (data: AdminFiltersFormInputs) => {
    dispatch(updateAdminFields(data));
    dispatch(updateProducts(null));
  };

  const onClientSubmit = (data: ClientFiltersFormInputs) => {
    dispatch(updateClientFields(data));
    dispatch(updateProducts(null));
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
                <Button variant='contained' onClick={() => navigate('/statistics')}>Статистика</Button>
              </>
              : <CreateProductButton />
            }
            <LogoutButton />
          </Stack>

          { isAdmin 
            ? <AdminFilters defaultValues={adminFilterValues} onSubmit={onAdminSubmit} />
            : <ClientFilters defaultValues={clientFilterValues} onSubmit={onClientSubmit} />
          }

          { isProductsLoading 
            ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box> 
            : !!productsData && productsData.length > 0
            ? <ProductsTable products={productsData}/> 
            : <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Typography variant='h4'>Пусто</Typography></Box> 
          }
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProductsPage;
