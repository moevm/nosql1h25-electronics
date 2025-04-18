import { Button, Paper, Stack, Typography, Select, MenuItem, TextField, Container } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/RequestsTable';
import { Category } from '@src/model/category';
import { useState } from 'react';
import type { DateType } from '@src/model/misc';
import type { Status } from '@src/model/status';
import { requests as requestsData } from '@src/model/data.example';

export const RequestsClientPage = () => {
  const [fromDate, setFromDate] = useState<DateType | null>(null);
  const [toDate, setToDate] = useState<DateType | null>(null);
  const [status, setStatus] = useState<Status['type'] | 'any'>('any');
  const [category, setCategory] = useState<Category | 'any'>('any');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sortField, setSortField] = useState<'title' | 'category' | 'status' | 'date' | 'client' | 'me' | 'any'>('any');

  return (
    <Container maxWidth='lg'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack gap={2}>
          <Typography variant='h4'>Список заявок</Typography>

          <Stack direction='row'>
            <Button variant='contained'>Перейти в профиль</Button>
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography component='p' variant='body1'>Дата изменения статуса (от):</Typography>
            <DatePicker value={fromDate} onChange={value => setFromDate(value)} />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography component='p' variant='body1'>Дата изменения статуса (до):</Typography>
            <DatePicker value={toDate}  onChange={value => setToDate(value)} />
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

          <Stack direction='row'>
            <Button variant='contained'>Применить фильтры</Button>
          </Stack>

          <Stack direction='row' alignItems='end' gap={2}>
            <Stack direction='row' alignItems='center' gap={1}>
              <Typography variant='body1'>Соритровать по:</Typography>
              <Select value={sortField} onChange={e => setSortField(e.target.value as typeof sortField)}>
                <MenuItem value='any'>-</MenuItem>
                <MenuItem value='title'>Названию</MenuItem>
                <MenuItem value='category'>Категории</MenuItem>
                <MenuItem value='status'>Статусу</MenuItem>
                <MenuItem value='date'>Дате назначения статуса</MenuItem>
                <MenuItem value='client'>Клиенту</MenuItem>
                <MenuItem value='me'>Участию в разрешении</MenuItem>
              </Select>
              <Button variant='contained'>Сортировать</Button>
            </Stack>


            <Stack gap={2}>
              <TextField placeholder='Название...' value={title} onChange={e => setTitle(e.target.value)} />
              <TextField placeholder='Описание...' value={description} onChange={e => setDescription(e.target.value)}/>
            </Stack>
          </Stack>

          <RequestsTable requests={requestsData}/> 
        </Stack>
      </Paper>
    </Container>
  );
};

export default RequestsClientPage;
