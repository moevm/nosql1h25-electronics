import { Button, Paper, Stack, Typography, Container, CircularProgress, Box } from '@mui/material';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { logout, selectIsLoggingOut } from '@src/store/UserSlice';
import { reset, selectClientForm, selectIsLoading, selectRequests, updateClientFields, updateRequests } from '@src/store/RequestsSlice';
import { useEffect, useState } from 'react';
import CreateRequestDialog from '@src/components/ui/ProductCreateDialog';
import { useNavigate } from 'react-router-dom';
import { ClientFilters, ClientFiltersFormInputs } from '@src/components/ui/ClientFilters';


export const RequestsClientPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const isLoggingOut = useAppSelector(selectIsLoggingOut);

  const isRequestsLoading = useAppSelector(selectIsLoading);
  const requestsData = useAppSelector(selectRequests);
  const fieldsValues = useAppSelector(selectClientForm);

  const [isCreateDialogOpened, setIsCreateDialogOpened] = useState(false);

  useEffect(() => {
    dispatch(updateRequests(null));
  }, []);

  const onSubmit = (data: ClientFiltersFormInputs) => {
    dispatch(updateClientFields(data));
    dispatch(updateRequests(null));
  };

  const onLogout = async () => {
    await dispatch(logout())
    dispatch(reset());
  };

  return (
    <Container maxWidth='lg'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack gap={1}>
          <Typography variant='h4'>Список заявок</Typography>

          <Stack direction='row' gap={1}>
            <Button 
              variant='contained'
              onClick={() => navigate('/profile')}
            >
              Перейти в профиль
            </Button>
            <Button
              variant='contained'
              disabled={isLoggingOut}
              onClick={onLogout}
            >
              { isLoggingOut ? <CircularProgress size={25} /> : 'Выход' }
            </Button>
          </Stack>

          <ClientFilters defaultValues={fieldsValues} onSubmit={onSubmit} />

          <Stack direction='row' gap={1}>
            <CreateRequestDialog
              open={isCreateDialogOpened}
              onClose={() => setIsCreateDialogOpened(false)}
              onSubmit={() => dispatch(updateRequests(null))}
            />

            <Button variant='contained' onClick={() => setIsCreateDialogOpened(true)}>Создать заявку</Button>
          </Stack>

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

export default RequestsClientPage;
