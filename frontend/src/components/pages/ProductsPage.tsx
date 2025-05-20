import { Button, Paper, Stack, Typography, Container } from '@mui/material';
import { ProductsTable } from '@src/components/ui/ProductsTable';
import { useAppSelector } from '@src/hooks/ReduxHooks';
import { useNavigate } from 'react-router-dom';
import { ClientFilters, ClientFiltersFormInputs } from '@src/components/ui/ClientFilters';
import { LogoutButton } from '@src/components/ui/buttons/LogoutButton';
import { CreateProductButton } from '@src/components/ui/buttons/CreateProductButton';
import { selectIsAdmin } from '@src/store/UserSlice';
import { AdminFilters, AdminFiltersFormInputs } from '@src/components/ui/AdminFilters';
import { BackupExportButton } from '@src/components/ui/buttons/BackupExportButton';
import { BackupImportButton } from '@src/components/ui/buttons/BackupImportButton';
import { useCallback, useState } from 'react';
import { ApiService } from '@src/api';
import dayjs from 'dayjs';

export const ProductsPage = () => {
  const navigate = useNavigate();

  const isAdmin = useAppSelector(selectIsAdmin);

  const [adminFilters, setAdminFilters] = useState<AdminFiltersFormInputs>(() => {
    if (localStorage.getItem('adminFilters')) {
      const { from, to, ...rest }: Omit<AdminFiltersFormInputs, 'from' | 'to'> & { from?: string, to?: string } = JSON.parse(localStorage.getItem('adminFilters')!);
      return { ...rest, from: from ? dayjs(from) : undefined, to: to ? dayjs(to) : undefined };
    }

    return { status: 'any', category: 'any', me: false };
  });

  const getProductsWithAdminFilters = useCallback(async (page: number, pageSize: number) => {
    const {
      from,
      to,
      status,
      category,
      me,
      ...restFilters
    } = adminFilters;

    return await ApiService.apiRequestsRetrieve({
      from: from?.format('YYYY-MM-DD'),
      to: to?.format('YYYY-MM-DD'),
      status: status === 'any' ? undefined : status,
      category: category === 'any' ? undefined : category,
      me: me === true ? true : undefined,
      amount: pageSize,
      offset: page*pageSize,
      ...restFilters,
    });
  }, [adminFilters]);

  const onAdminSubmit = (data: AdminFiltersFormInputs) => {
    localStorage.setItem('adminFilters', JSON.stringify(data));
    setAdminFilters(data);
  };

  
  const [clientFilters, setClientFilters] = useState<ClientFiltersFormInputs>(() => {
    if (localStorage.getItem('clientFilters'))
      return JSON.parse(localStorage.getItem('clientFilters')!);

    return {};
  });

  const getProductsWithClientFilters = useCallback(async (page: number, pageSize: number) => {
    const {
      from,
      to,
      status,
      category,
      sort,
      ...restFilters
    } = clientFilters;

    return await ApiService.apiRequestsRetrieve({
      from: from?.format('YYYY-MM-DD'),
      to: to?.format('YYYY-MM-DD'),
      status: status === 'any' ? undefined : status,
      category: category === 'any' ? undefined : category,
      sort: sort === 'any' ? undefined : sort,
      amount: pageSize,
      offset: page*pageSize,
      ...restFilters,
    });
  }, [clientFilters]);


  const onClientSubmit = (data: ClientFiltersFormInputs) => {
    localStorage.setItem('clientFilters', JSON.stringify(data));
    setClientFilters(data);
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
            ? <AdminFilters defaultValues={adminFilters} onSubmit={onAdminSubmit} />
            : <ClientFilters defaultValues={clientFilters} onSubmit={onClientSubmit} />
          }

          <ProductsTable pageSize={10} getData={isAdmin ? getProductsWithAdminFilters : getProductsWithClientFilters}/>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProductsPage;
