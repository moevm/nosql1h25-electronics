import { Box, Button, Stack, Typography } from '@mui/material';
import { CategoryEnum, TypeEnum } from '@src/api';
import { DateFormField, DateType } from '@src/components/ui/form/DateFormField';
import { TextFormField } from '@src/components/ui/form/TextFormField';
import { categoryMap, statusMap } from '@src/lib/RussianConverters';
import { SelectFormField } from '@src/components/ui/form/SelectFormField';
import { CheckboxFormField } from '@src/components/ui/form/CheckboxFormField';
import { useForm } from 'react-hook-form';
import { useEffect, KeyboardEvent } from 'react';

export interface AdminFiltersFormInputs {
  from?: DateType;
  to?: DateType;
  status: TypeEnum | 'any';
  author?: string;
  me: boolean;
  category: CategoryEnum | 'any';
  title?: string;
  description?: string;
}

const fieldNames: Array<keyof AdminFiltersFormInputs> = [
  'from',
  'to',
  'status',
  'author',
  'me',
  'category',
  'title',
  'description',
];

export interface AdminFiltersProps {
  defaultValues?: Partial<AdminFiltersFormInputs>;
  onSubmit?: (data: AdminFiltersFormInputs) => void | Promise<void>;
}

export const AdminFilters = ({ defaultValues, onSubmit=(() => {}) }: AdminFiltersProps) => {
  const { control, handleSubmit, setValue } = useForm<AdminFiltersFormInputs>();
  
  useEffect(() => {
    if (!defaultValues) return;

    for (const key of fieldNames)
      if (defaultValues[key]) setValue(key, defaultValues[key]);
  }, []);

  const onEnterDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    handleSubmit(onSubmit)();
  };

  return (
    <Stack gap={1}>
      <Stack direction='row' gap={1} alignItems='center'>
        <Typography variant='body1'>Дата изменения статуса (от):</Typography>
        <DateFormField prohibitFuture name='from' control={control} />
      </Stack>

      <Stack direction='row' gap={1} alignItems='center'>
        <Typography variant='body1'>Дата изменения статуса (до):</Typography>
        <DateFormField 
          prohibitFuture 
          validate={(value, formFields) => {
            if (formFields.from && value! < formFields.from) 
              return 'Дата конца раньше даты начала'; 
          }}
          name='to' 
          control={control}
        />
      </Stack>

      <Stack direction='row' gap={1} alignItems='center'>
        <Typography variant='body1'>Статус заявки:</Typography>
        <SelectFormField
          options={{
            any: 'Всё',
            ...statusMap,
          }}
          defaultValue='any'
          name='status'
          control={control}
        />
      </Stack>

      <Stack direction='row' gap={1} alignItems='center'>
        <Typography variant='body1'>Клиент:</Typography>
        <TextFormField placeholder='ФИО' onKeyDown={onEnterDown} name='author' control={control} />
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
          <SelectFormField
            options={{
              any: 'Всё',
              ...categoryMap,
            }}
            defaultValue='any'
            name='category'
            control={control}
          />
        </Stack>

        <TextFormField placeholder='Название...' onKeyDown={onEnterDown} name='title' control={control} />
        
        <Button variant='contained' onClick={handleSubmit(onSubmit)}>Применить фильтры</Button>

        <TextFormField placeholder='Описание...' onKeyDown={onEnterDown} name='description' control={control} />
      </Box>
    </Stack>
  );
};

export default AdminFilters;
