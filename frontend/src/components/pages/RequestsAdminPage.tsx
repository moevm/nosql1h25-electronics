import { Button, Paper, Stack, Typography, Select, MenuItem, Box, Container, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import { CheckboxFormField, TextFormField } from '@src/components/ui/FormFields';
import { DateType } from '@src/model/misc';
import { Category } from '@src/model/category';
import { Status } from '@src/model/status';
import dayjs from 'dayjs';
import { Control, Controller, useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { logout, selectIsLoggingOut } from '@src/store/UserSlice';
import { reset, selectAdminForm, selectIsLoading, selectRequests, updateFields, updateRequests } from '@src/store/RequestsSlice';
import { useEffect } from 'react';

export interface RequestsAdminFormInputs {
  fromDate?: DateType;
  toDate?: DateType;
  status: Status['type'] | 'any';
  author?: string;
  helpedResolving: boolean;
  category: Category | 'any';
  title?: string;
  description?: string;
}

interface FormFieldProps {
  control: Control<RequestsAdminFormInputs>;
}

const FromDateFormField = (props: FormFieldProps) => (
  <Controller 
    {...props}
    name='fromDate'
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
    name='toDate'
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
        required: (value, { fromDate }) => {
          if (!value) return;
          if (value > dayjs()) return 'Выбрана дата из будущего';
          if (fromDate && value < fromDate) return 'Дата конца раньше даты начала';
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
        <MenuItem value='created'>Создана</MenuItem>
        <MenuItem value='price_offer'>Предложена цена</MenuItem>
        <MenuItem value='price_accept'>Цена подтверждена</MenuItem>
        <MenuItem value='date_offer'>Предложена дата</MenuItem>
        <MenuItem value='date_accept'>Дата подтверждена</MenuItem>
        <MenuItem value='closed'>Закрыта</MenuItem>
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
      <MenuItem value={Category.Laptop}>Ноутбук</MenuItem>
      <MenuItem value={Category.Smartphone}>Смартфон</MenuItem>
      <MenuItem value={Category.Tablet}>Планшет</MenuItem>
      <MenuItem value={Category.PC}>Персональный компьютер</MenuItem>
      <MenuItem value={Category.TV}>Телевизор</MenuItem>
      <MenuItem value={Category.Audio}>Наушники и колонки</MenuItem>
      <MenuItem value={Category.Console}>Игровые приставки</MenuItem>
      <MenuItem value={Category.Periphery}>Комьютерная периферия</MenuItem>
      <MenuItem value={Category.Other}>Прочее</MenuItem>
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

  useEffect(() => {
    if (fieldsValues.fromDate) setValue('fromDate', fieldsValues.toDate);
    if (fieldsValues.toDate) setValue('toDate', fieldsValues.toDate);
    if (fieldsValues.status) setValue('status', fieldsValues.status);
    if (fieldsValues.author) setValue('author', fieldsValues.author);
    if (fieldsValues.helpedResolving) setValue('helpedResolving', fieldsValues.helpedResolving);
    if (fieldsValues.category) setValue('category', fieldsValues.category);
    if (fieldsValues.title) setValue('title', fieldsValues.title);
    if (fieldsValues.description) setValue('description', fieldsValues.description);

    dispatch(updateRequests(null));
  }, []);

  const onSubmit = (data: RequestsAdminFormInputs) => {
    dispatch(updateFields(data));
    dispatch(updateRequests(null));
  };

  return (
    <Container maxWidth='lg'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack gap={1}>
          <Typography variant='h4'>Список заявок</Typography>

          <Stack direction='row' gap={1}>
            <Button variant='contained'>Профиль</Button>
            <Button variant='contained'>Экспорт БД</Button>
            <Button variant='contained'>Импорт БД</Button>
            <Button variant='contained'>Статистика</Button>
            <Button 
              variant='contained' 
              disabled={isLoggingOut} 
              onClick={() => {
                dispatch(logout()).then(() => dispatch(reset()));
              }}
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

          <CheckboxFormField label='Участвовал в разрешении' name='helpedResolving' control={control} />

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
            : requestsData !== undefined 
            ? <RequestsTable requests={requestsData}/> 
            : <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Typography variant='h4'>Пусто</Typography></Box> 
          }
        </Stack>
      </Paper>
    </Container>
  );
};

export default RequestsClientPage;
