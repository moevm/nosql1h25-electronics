import { Box, Button, Stack, Typography } from '@mui/material';
import { CategoryEnum, TypeEnum } from '@src/api';
import DateFormField, { DateType } from '@src/components/ui/form/DateFormField';
import { useEffect, KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { SelectFormField } from '@src/components/ui/form/SelectFormField';
import { categoryMap, statusMap } from '@src/lib/RussianConverters';
import TextFormField from '@src/components/ui/form/TextFormField';

export interface ClientFiltersFormInputs {
  from?: DateType;
  to?: DateType;
  status: TypeEnum | 'any';
  category: CategoryEnum | 'any';
  title?: string;
  description?: string;
  sort: 'title' | 'category' | 'last_update' | 'any';
}

const fieldNames: Array<keyof ClientFiltersFormInputs> = [
  'from',
  'to',
  'status',
  'category',
  'title',
  'description',
  'sort',
];

export interface ClientFiltersProps {
  defaultValues?: Partial<ClientFiltersFormInputs>;
  onSubmit?: (data: ClientFiltersFormInputs) => void | Promise<void>;
}

export const ClientFilters = ({ defaultValues, onSubmit=(() => {}) }: ClientFiltersProps) => {
  const { control, handleSubmit, setValue } = useForm<ClientFiltersFormInputs>();
  
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
        <Typography component='p' variant='body1'>Дата изменения статуса (от):</Typography>
        <DateFormField prohibitFuture name='from' control={control} />
      </Stack>

      <Stack direction='row' gap={1} alignItems='center'>
        <Typography component='p' variant='body1'>Дата изменения статуса (до):</Typography>
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

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gridTemplateRows: 'repeat(2, auto)',
        justifyContent: 'start',
        alignItems: 'center',
        gap: '5px 20px',
      }}>
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='body1'>Соритровать по:</Typography>
          <SelectFormField
            options={{
              any: '-',
              title: 'Названию',
              last_update: 'Последнему обновлению',
              category: 'Категории',
            }}
            defaultValue='any' 
            name='sort'
            control={control}
          />
        </Stack>

        <TextFormField placeholder='Название...' onKeyDown={onEnterDown} name='title' control={control} />

        <Button variant='contained' onClick={handleSubmit(onSubmit)}>Обновить список</Button>
        
        <TextFormField placeholder='Описание...' onKeyDown={onEnterDown} name='description' control={control} />
      </Box>
    </Stack>
  );
};

export default ClientFilters; 
