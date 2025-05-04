import { Button, Paper, Stack, Typography, Select, MenuItem, Container, CircularProgress, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import type { DateType } from '@src/model/misc';
import dayjs from 'dayjs';
import { Control, Controller, useForm } from 'react-hook-form';
import { TextFormField } from '@src/components/ui/FormFields';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { logout, selectIsLoggingOut } from '@src/store/UserSlice';
import { reset, selectClientForm, selectIsLoading, selectRequests, updateClientFields, updateRequests } from '@src/store/RequestsSlice';
import { useEffect, useState } from 'react';
import { CategoryEnum } from '@src/api';
import CreateRequestDialog from '@src/components/ui/ProductCreateDialog';
import { useNavigate } from 'react-router-dom';

export interface RequestsClientFormInputs {
  from?: DateType;
  to?: DateType;
  status: string;
  category: CategoryEnum | 'any';
  title?: string;
  description?: string;
  sort: 'title' | 'category' | 'description' | 'address' | 'fullname' | 'last_update' | 'any';
}

interface FormFieldProps {
  control: Control<RequestsClientFormInputs>;
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

const SortFieldFormField = (props: FormFieldProps) => (
  <Controller 
    {...props}
    name='sort'
    render={({ field }) => (
      <Select 
        value={field.value} 
        onChange={field.onChange}
      >
        <MenuItem value='any'>-</MenuItem>
        <MenuItem value='title'>Названию</MenuItem>
        <MenuItem value='last_update'>Последнему обновлению</MenuItem>
        <MenuItem value='category'>Категории</MenuItem>
      </Select>
    )}
    defaultValue='any'
  />
);

export const RequestsClientPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, setValue } = useForm<RequestsClientFormInputs>();

  const dispatch = useAppDispatch();
  const isLoggingOut = useAppSelector(selectIsLoggingOut);

  const isRequestsLoading = useAppSelector(selectIsLoading);
  const requestsData = useAppSelector(selectRequests);
  const fieldsValues = useAppSelector(selectClientForm);

  const [isCreateDialogOpened, setIsCreateDialogOpened] = useState(false);

  useEffect(() => {
    if (fieldsValues.from) setValue('from', fieldsValues.from);
    if (fieldsValues.to) setValue('to', fieldsValues.to);
    if (fieldsValues.status) setValue('status', fieldsValues.status);
    if (fieldsValues.category) setValue('category', fieldsValues.category);
    if (fieldsValues.title) setValue('title', fieldsValues.title);
    if (fieldsValues.description) setValue('description', fieldsValues.description);
    if (fieldsValues.sort) setValue('sort', fieldsValues.sort);

    dispatch(updateRequests(null));
  }, []);

  const onSubmit = (data: RequestsClientFormInputs) => {
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

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography component='p' variant='body1'>Дата изменения статуса (от):</Typography>
            <FromDateFormField control={control} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography component='p' variant='body1'>Дата изменения статуса (до):</Typography>
            <ToDateFormField control={control} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Статус заявки:</Typography>
            <StatusFormField control={control} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Категория товара:</Typography>
            <CategoryFormField control={control} />
          </Stack>

          <Stack direction='row'>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>Применить фильтры</Button>
          </Stack>

          <Stack direction='row' alignItems='end' gap={2}>
            <Stack direction='row' alignItems='center' gap={1}>
              <Typography variant='body1'>Соритровать по:</Typography>
              <SortFieldFormField control={control} />
              <Button variant='contained' onClick={handleSubmit(onSubmit)}>Сортировать</Button>
            </Stack>

            <Stack gap={1}>
              <TextFormField placeholder='Название...' name='title' control={control} />
              <TextFormField placeholder='Описание...' name='description' control={control} />
            </Stack>
          </Stack>

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
