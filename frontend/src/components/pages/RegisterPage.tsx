import { FormEvent } from 'react';
import { Paper, Typography, TextField, Button, Stack, Container } from '@mui/material';

export const RegisterPage = () => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Container maxWidth='sm'>
      <Paper component='form' elevation={5} onSubmit={onSubmit} sx={{ mt: 3, p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Регистрация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <TextField placeholder='Логин' name='login' required /> 
          </Stack> 

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Пароль:</Typography>
            <TextField placeholder='Пароль' type='password' name='password' required /> 
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>ФИО:</Typography>
            <TextField placeholder='Иванов Иван Иванович' name='fullname' required /> 
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Номер телефона:</Typography>
            <TextField placeholder='+70000000000' slotProps={{ htmlInput: { pattern: '\\+7\\d{10}' } }} type='tel' name='phone' required /> 
          </Stack>

          <Stack direction='column' gap={1}>
            <Button type='submit' variant='contained'>Зарегистрироваться</Button>
            <Button>Авторизация</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
