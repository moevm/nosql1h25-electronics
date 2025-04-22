import { Button, Paper, Stack, Typography, Select, MenuItem, Box, Container, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import { CheckboxFormField, TextFormField } from '@src/components/ui/FormFields';
import { DateType } from '@src/model/misc';
import dayjs from 'dayjs';
import { Control, Controller, useForm } from 'react-hook-form';
import { saveAs } from 'file-saver';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { logout, selectIsLoggingOut } from '@src/store/UserSlice';
import { reset, selectAdminForm, selectIsLoading, selectRequests, updateAdminFields, updateRequests } from '@src/store/RequestsSlice';
import { useEffect, useRef } from 'react';
import { ApiService, CategoryEnum } from '@src/api';

export interface RequestsAdminFormInputs {
  from?: DateType;
  to?: DateType;
  status: string;
  author?: string;
  me: boolean;
  category: CategoryEnum | 'any';
  title?: string;
  description?: string;
}

interface FormFieldProps {
  control: Control<RequestsAdminFormInputs>;
}

const FromDateFormField = (props: FormFieldProps) => (
  <Controller 
    {...props}
    name='from'
    render={({ field, fieldState }) => (
      <DatePicker 
        maxDate={dayjs()}
        slotProps={{
          textField: {
            helperText: fieldState.error?.message,
            error: !!fieldState.error,
          },
        }}
        value={field.value}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: { 
        required: (value: DateType | undefined) => {
          if (!value) return;
          if (value > dayjs()) return 'Выбрана дата из будущего';
        },
      },
    }}
  />
);

const ToDateFormField = (props: FormFieldProps) => (
  <Controller 
    {...props}
    name='to'
    render={({ field, fieldState }) => (
      <DatePicker 
        maxDate={dayjs()}
        slotProps={{
          textField: {
            helperText: fieldState.error?.message,
            error: !!fieldState.error,
          },
        }}
        value={field.value}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: { 
        required: (value, { from }) => {
          if (!value) return;
          if (value > dayjs()) return 'Выбрана дата из будущего';
          if (from && value < from) return 'Дата конца раньше даты начала';
        },
      },
    }}
  />
);

const StatusFormField = (props: FormFieldProps) => (
  <Controller 
    {...props}
    name='status'
    render={({ field }) => (
      <Select 
        value={field.value} 
        onChange={field.onChange}
      >
        <MenuItem value='any'>Все</MenuItem>
        <MenuItem value='created_status'>Создана</MenuItem>
        <MenuItem value='price_offer_status'>Предложена цена</MenuItem>
        <MenuItem value='price_accept_status'>Цена подтверждена</MenuItem>
        <MenuItem value='date_offer_status'>Предложена дата</MenuItem>
        <MenuItem value='date_accept_status'>Дата подтверждена</MenuItem>
        <MenuItem value='closed_status'>Закрыта</MenuItem>
      </Select>
    )}
    defaultValue='any'
  />
);

const CategoryFormField = (props: FormFieldProps) => (
  <Controller 
  {...props}
  name='category'
  render={({ field }) => (
    <Select 
      value={field.value} 
      onChange={field.onChange}
    >
      <MenuItem value='any'>Всё</MenuItem>
      <MenuItem value='laptop'>Ноутбук</MenuItem>
      <MenuItem value='smartphone'>Смартфон</MenuItem>
      <MenuItem value='tablet'>Планшет</MenuItem>
      <MenuItem value='pc'>Персональный компьютер</MenuItem>
      <MenuItem value='tv'>Телевизор</MenuItem>
      <MenuItem value='audio'>Наушники и колонки</MenuItem>
      <MenuItem value='console'>Игровые приставки</MenuItem>
      <MenuItem value='periphery'>Комьютерная периферия</MenuItem>
      <MenuItem value='other'>Прочее</MenuItem>
    </Select>
  )}
  defaultValue='any'
/>
);

export const RequestsClientPage = () => {
  const { control, handleSubmit, setValue } = useForm<RequestsAdminFormInputs>();
  
  const dispatch = useAppDispatch();
  const isLoggingOut = useAppSelector(selectIsLoggingOut);

  const isRequestsLoading = useAppSelector(selectIsLoading);
  const requestsData = useAppSelector(selectRequests);
  const fieldsValues = useAppSelector(selectAdminForm);

  const backupImportRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldsValues.from) setValue('from', fieldsValues.from);
    if (fieldsValues.to) setValue('to', fieldsValues.to);
    if (fieldsValues.status) setValue('status', fieldsValues.status);
    if (fieldsValues.author) setValue('author', fieldsValues.author);
    if (fieldsValues.me) setValue('me', fieldsValues.me);
    if (fieldsValues.category) setValue('category', fieldsValues.category);
    if (fieldsValues.title) setValue('title', fieldsValues.title);
    if (fieldsValues.description) setValue('description', fieldsValues.description);

    dispatch(updateRequests(null));
  }, []);

  const onSubmit = (data: RequestsAdminFormInputs) => {
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
    const formData = new FormData();
    formData.append('file', file);

    try {
      //await ApiService.apiBackupCreate({ requestBody: file });
      await fetch('http://localhost:8000/api/backup/', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.token}` }, body: formData });
      
      alert('Данные успешно импортированы');
    } catch {
      alert('Ошибка импорта данных');
    }
    
    e.target.value = '';
  };

  const onLogout = () => {
    dispatch(logout()).then(() => dispatch(reset()));
  };

  return (
    <Container maxWidth='lg'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack gap={1}>
          <Typography variant='h4'>Список заявок</Typography>

          <Stack direction='row' gap={1}>
            <Button variant='contained'>Профиль</Button>
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

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Дата изменения статуса (от):</Typography>
            <FromDateFormField control={control} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Дата изменения статуса (до):</Typography>
            <ToDateFormField control={control} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Статус заявки:</Typography>
            <StatusFormField control={control} /> 
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Клиент:</Typography>
            <TextFormField placeholder='ФИО' name='author' control={control} />
          </Stack>

          <CheckboxFormField label='Участвовал в разрешении' name='me' control={control} />

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, auto)',
            gridTemplateRows: 'repeat(2, auto)',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '5px 20px',
          }}>
            <Stack direction='row' gap={1} alignItems='center'>
              <Typography variant='body1'>Категория товара:</Typography>
              <CategoryFormField control={control} />
            </Stack>

            <TextFormField placeholder='Название...' name='title' control={control} />
            
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>Применить фильтры</Button>

            <TextFormField placeholder='Описание...' name='description' control={control}
            />
          </Box>

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
