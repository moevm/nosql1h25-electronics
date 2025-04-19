import { Button, Paper, Stack, Typography, Select, MenuItem, TextField, Checkbox, FormControlLabel, Box, Container } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/RequestsTable';
import { useState } from 'react';
import { DateType } from '@src/model/misc';
import { Category } from '@src/model/category';
import { Status } from '@src/model/status';
import style from './RequestsAdminPage.module.css';

import { requests as requestsData } from '@src/model/data.example';
import dayjs from 'dayjs';

export const RequestsClientPage = () => {
  const [fromDate, setFromDate] = useState<DateType | null>(null);
  const [toDate, setToDate] = useState<DateType | null>(null);
  const [status, setStatus] = useState<Status['type'] | 'any'>('any');
  const [client, setClient] = useState<string>('');
  const [helpedResolving, setHelpedResolving] = useState<boolean>(false);
  const [category, setCategory] = useState<Category | 'any'>('any');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  return (
    <Container maxWidth='lg'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack gap={2}>
          <Typography variant='h4'>Список заявок</Typography>

          <Stack direction='row' gap={1}>
            <Button variant='contained'>Профиль</Button>
            <Button variant='contained'>Экспорт БД</Button>
            <Button variant='contained'>Импорт БД</Button>
            <Button variant='contained'>Статистика</Button>
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Дата изменения статуса (от):</Typography>
            <DatePicker maxDate={dayjs()} value={fromDate} onChange={value => setFromDate(value)} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Дата изменения статуса (до):</Typography>
            <DatePicker maxDate={dayjs()} value={toDate}  onChange={value => setToDate(value)} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Статус заявки:</Typography>
            <Select value={status} onChange={e => setStatus(e.target.value as typeof status)}>
              <MenuItem value='any'>Все</MenuItem>
              <MenuItem value='created'>Создана</MenuItem>
              <MenuItem value='price_offer'>Предложена цена</MenuItem>
              <MenuItem value='price_accept'>Цена подтверждена</MenuItem>
              <MenuItem value='date_offer'>Предложена дата</MenuItem>
              <MenuItem value='date_accept'>Дата подтверждена</MenuItem>
              <MenuItem value='closed'>Закрыта</MenuItem>
            </Select>
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Клиент:</Typography>
            <TextField 
              placeholder='ФИО' 
              value={client} 
              onChange={e => setClient(e.target.value)}
            />
          </Stack>

          <FormControlLabel 
            control={<Checkbox 
              value={helpedResolving}
              onChange={e => setHelpedResolving(e.target.checked)}
            />} 
            label='Участвовал в разрешении'
          />

          <Box className={style['apply-filters-container']}>
            <Stack direction='row' gap={1} alignItems='center'>
              <Typography variant='body1'>Категория товара:</Typography>
              <Select value={category} onChange={e => setCategory(e.target.value as typeof category)}>
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
            </Stack>

            <TextField
              placeholder='Название...'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            
            <Button variant='contained'>Применить фильтры</Button>

            <TextField 
              placeholder='Описание...' 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </Box>

          <RequestsTable requests={requestsData}/> 
        </Stack>
      </Paper>
    </Container>
  );
};

export default RequestsClientPage;
