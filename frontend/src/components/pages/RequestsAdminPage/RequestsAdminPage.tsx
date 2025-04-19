import { Button, Paper, Stack, Typography, Select, MenuItem, Box, Container } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import { CheckboxFormField, TextFormField } from '@src/components/ui/FormFields';
import { DateType } from '@src/model/misc';
import { Category } from '@src/model/category';
import { Status } from '@src/model/status';
import dayjs from 'dayjs';
import { Control, Controller, useForm } from 'react-hook-form';
import style from './RequestsAdminPage.module.css';

import { requests as requestsData } from '@src/model/data.example';

interface FormInputs {
  fromDate?: DateType;
  toDate?: DateType;
  status: Status['type'] | 'any';
  client?: string;
  helpedResolving: boolean;
  category: Category | 'any';
  title?: string;
  description?: string;
}

interface FormFieldProps {
  control: Control<FormInputs>;
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
  const { control, handleSubmit } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    alert(JSON.stringify(data));
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
            <TextFormField placeholder='ФИО' name='client' control={control} />
          </Stack>

          <CheckboxFormField label='Участвовал в разрешении' name='helpedResolving' control={control} />

          <Box className={style['apply-filters-container']}>
            <Stack direction='row' gap={1} alignItems='center'>
              <Typography variant='body1'>Категория товара:</Typography>
              <CategoryFormField control={control} />
            </Stack>

            <TextFormField placeholder='Название...' name='title' control={control} />
            
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>Применить фильтры</Button>

            <TextFormField placeholder='Описание...' name='description' control={control}
            />
          </Box>

          <RequestsTable requests={requestsData}/> 
        </Stack>
      </Paper>
    </Container>
  );
};

export default RequestsClientPage;
