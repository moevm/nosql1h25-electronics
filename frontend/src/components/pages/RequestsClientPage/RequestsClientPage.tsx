import { Button, Paper, Stack, Typography, Select, MenuItem, TextField, Checkbox, FormControlLabel, Box, Container } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RequestsTable } from '@src/components/RequestsTable';
import { requests as requestsData } from '@src/model/data.example';
import style from './RequestsClientPage.module.css';

export const RequestsClientPage = () => {
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
            <Typography component='p' variant='body1'>Дата изменения статуса (от):</Typography>
            <DatePicker />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography component='p' variant='body1'>Дата изменения статуса (до):</Typography>
            <DatePicker />
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Статус заявки:</Typography>
            <Select defaultValue='Все'>
              <MenuItem value='Все'>Все</MenuItem>
              <MenuItem value='Создана'>Создана</MenuItem>
              <MenuItem value='Предложена цена'>Предложена цена</MenuItem>
              <MenuItem value='Цена подтверждена'>Цена подтверждена</MenuItem>
              <MenuItem value='Предложена дата'>Предложена дата</MenuItem>
              <MenuItem value='Дата подтверждена'>Дата подтверждена</MenuItem>
              <MenuItem value='Закрыта'>Закрыта</MenuItem>
            </Select>
          </Stack>

          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>Клиент:</Typography>
            <TextField placeholder='ФИО' />
          </Stack>

          <FormControlLabel control={<Checkbox />} label='Участвовал в разрешении' />

          <Box className={style['apply-filters-container']}>
            <Stack direction='row' gap={1} alignItems='center'>
              <Typography variant='body1'>Категория товара:</Typography>
              <Select defaultValue='Всё'>
                <MenuItem value='Всё'>Всё</MenuItem>
                <MenuItem value='Ноутбук'>Ноутбук</MenuItem>
                <MenuItem value='Смартфон'>Смартфон</MenuItem>
                <MenuItem value='Планшет'>Планшет</MenuItem>
                <MenuItem value='Персональный компьютер'>Персональный компьютер</MenuItem>
                <MenuItem value='Телевизор'>Телевизор</MenuItem>
                <MenuItem value='Наушники и колонки'>Наушники и колонки</MenuItem>
                <MenuItem value='Игровые приставки'>Игровые приставки</MenuItem>
                <MenuItem value='Комьютерная периферия'>Комьютерная периферия</MenuItem>
                <MenuItem value='Прочее'>Прочее</MenuItem>
              </Select>
            </Stack>

            <TextField placeholder='Название...' />
            
            <Button variant='contained'>Применить фильтры</Button>

            <TextField placeholder='Описание...' />
          </Box>

          <RequestsTable requests={requestsData}/> 
        </Stack>
      </Paper>
    </Container>
    
  );
};

export default RequestsClientPage;
