import { Button, Paper, Stack, Typography, Box, Container, CircularProgress } from '@mui/material';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { logout, selectIsLoggingOut } from '@src/store/UserSlice';
import { reset, selectAdminForm, selectIsLoading, selectRequests, updateAdminFields, updateRequests } from '@src/store/RequestsSlice';
import { useEffect, useRef } from 'react';
import { ApiService } from '@src/api';
import { useNavigate } from 'react-router-dom';
import { AdminFilters, AdminFiltersFormInputs } from '@src/components/ui/AdminFilters';

export const RequestsClientPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const isLoggingOut = useAppSelector(selectIsLoggingOut);

  const isRequestsLoading = useAppSelector(selectIsLoading);
  const requestsData = useAppSelector(selectRequests);
  const fieldsValues = useAppSelector(selectAdminForm);

  const backupImportRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(updateRequests(null));
  }, []);

  const onSubmit = (data: AdminFiltersFormInputs) => {
    dispatch(updateAdminFields(data));
    dispatch(updateRequests(null));
  };

  const onExportBackup = () => {
    ApiService.apiBackupRetrieve().then(data => {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      saveAs(blob, `backup-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.json`);
      alert('Данные успешно экспортированы'); // по макету
    }).catch(() => alert('Ошибка экспорта данных'));
  };

  const onImportBackup = async () => {
    if (!confirm('Это действие сотрёт все существующие данные в БД и заменит их теми, что в файле. Вы уверены, что хотите продолжить?')) return;

    backupImportRef.current?.click();
  };

  const onBackupFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      await ApiService.apiBackupCreate({ formData: { file }});

      alert('Данные успешно импортированы');
      dispatch(logout()).then(() => dispatch(reset()));
    } catch {
      alert('Ошибка импорта данных');
    }
    
    e.target.value = '';
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
            <Button variant='contained' onClick={() => navigate('/profile')}>Профиль</Button>
            <Button variant='contained' onClick={onExportBackup}>Экспорт БД</Button>
            <Button variant='contained' onClick={onImportBackup}>Импорт БД</Button>
            <input
              ref={backupImportRef}
              style={{ display: 'none' }}
              type='file'
              accept='application/JSON'
              onChange={onBackupFileChanged} 
            />
            <Button variant='contained'>Статистика</Button>
            <Button 
              variant='contained' 
              disabled={isLoggingOut} 
              onClick={onLogout}
            >
              { isLoggingOut ? <CircularProgress size={25} /> : 'Выход' }
            </Button>
          </Stack>

          <AdminFilters defaultValues={fieldsValues} onSubmit={onSubmit} />

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
