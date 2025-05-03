import { Button, Paper, Stack, Typography, Select, MenuItem, Container, CircularProgress, Box } from '@mui/material';
import { RequestsTable } from '@src/components/ui/RequestsTable';
import { useForm } from 'react-hook-form';
import { TextFormField } from '@src/components/ui/form/TextFormField';
import { DateFormField, DateType } from '@src/components/ui/form/DateFormField';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { logout, selectIsLoggingOut } from '@src/store/UserSlice';
import { reset, selectClientForm, selectIsLoading, selectRequests, updateClientFields, updateRequests } from '@src/store/RequestsSlice';
import { useEffect, useState } from 'react';
import { CategoryEnum, TypeEnum } from '@src/api';
import CreateRequestDialog from '@src/components/ui/ProductCreateDialog';
import { useNavigate } from 'react-router-dom';
import { SelectFormField } from '@src/components/ui/form/SelectFormField';
import { categoryMap, statusMap } from '@src/lib/RussianConverters';

export interface RequestsClientFormInputs {
  from?: DateType;
  to?: DateType;
  status: TypeEnum | 'any';
  category: CategoryEnum | 'any';
  title?: string;
  description?: string;
  sort: 'title' | 'category' | 'last_update' | 'any';
}

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

          <Stack direction='row'>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>Применить фильтры</Button>
          </Stack>

          <Stack direction='row' alignItems='end' gap={2}>
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
