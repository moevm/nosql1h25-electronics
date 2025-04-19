import { Button, Paper, Stack, Typography, Select, MenuItem, Container } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import { Category } from '@src/model/category';
import type { DateType } from '@src/model/misc';
import type { Status } from '@src/model/status';
import dayjs from 'dayjs';
import { Control, Controller, useForm } from 'react-hook-form';
import { TextFormField } from '@src/components/ui/FormFields';

import { requests as requestsData } from '@src/model/data.example';

interface FormInputs {
  fromDate?: DateType;
  toDate?: DateType;
  status: Status['type'] | 'any';
  category: Category | 'any';
  title?: string;
  description?: string;
  sortField: 'title' | 'category' | 'status' | 'date' | 'client' | 'me' | 'any';
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

const SortFieldFormField = (props: FormFieldProps) => (
  <Controller 
    {...props}
    name='sortField'
    render={({ field }) => (
      <Select 
        value={field.value} 
        onChange={field.onChange}
      >
        <MenuItem value='any'>-</MenuItem>
        <MenuItem value='title'>Названию</MenuItem>
        <MenuItem value='category'>Категории</MenuItem>
        <MenuItem value='status'>Статусу</MenuItem>
        <MenuItem value='date'>Дате назначения статуса</MenuItem>
        <MenuItem value='client'>Клиенту</MenuItem>
        <MenuItem value='me'>Участию в разрешении</MenuItem>
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

          <Stack direction='row'>
            <Button variant='contained'>Перейти в профиль</Button>
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

          <RequestsTable requests={requestsData}/> 
        </Stack>
      </Paper>
    </Container>
  );
};

export default RequestsClientPage;
