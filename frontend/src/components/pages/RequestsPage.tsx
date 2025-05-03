import { Button, Paper, Stack, Typography, Container, CircularProgress, Box } from '@mui/material';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { selectAdminForm, selectClientForm, selectIsLoading, selectRequests, updateClientFields, updateRequests } from '@src/store/RequestsSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientFilters, ClientFiltersFormInputs } from '@src/components/ui/ClientFilters';
import { LogoutButton } from '@src/components/ui/buttons/LogoutButton';
import { CreateRequestButton } from '@src/components/ui/buttons/CreateRequestButton';
import { selectIsAdmin } from '@src/store/UserSlice';
import { AdminFilters, AdminFiltersFormInputs } from '@src/components/ui/AdminFilters';
import { BackupExportButton } from '@src/components/ui/buttons/BackupExportButton';
import { BackupImportButton } from '@src/components/ui/buttons/BackupImportButton';

export const RequestsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isRequestsLoading = useAppSelector(selectIsLoading);
  const requestsData = useAppSelector(selectRequests);
  const isAdmin = useAppSelector(selectIsAdmin);
  const adminFilterValues = useAppSelector(selectAdminForm);
  const clientFilterValues = useAppSelector(selectClientForm);

  useEffect(() => {
    dispatch(updateRequests(null));
  }, []);

  const onAdminSubmit = (data: AdminFiltersFormInputs) => {
    dispatch(updateClientFields(data));
    dispatch(updateRequests(null));
  };

  const onClientSubmit = (data: ClientFiltersFormInputs) => {
    dispatch(updateClientFields(data));
    dispatch(updateRequests(null));
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
              : <CreateRequestButton />
            }
            <LogoutButton />
          </Stack>

          { isAdmin 
            ? <AdminFilters defaultValues={adminFilterValues} onSubmit={onAdminSubmit} />
            : <ClientFilters defaultValues={clientFilterValues} onSubmit={onClientSubmit} />
          }

          { isRequestsLoading 
            ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box> 
            : !!requestsData && requestsData.length > 0
            ? <RequestsTable requests={requestsData}/> 
            : <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Typography variant='h4'>Пусто</Typography></Box> 
          }
        </Stack>
      </Paper>
    </Container>
  );
};

export default RequestsPage;
