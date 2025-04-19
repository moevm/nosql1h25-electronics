import { FormEvent, useState } from 'react';
import { Paper, Typography, TextField, Button, Stack, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import style from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Container maxWidth='xs' className={style.container}>
      <Paper 
        component='form' 
        elevation={5} 
        onSubmit={onSubmit} 
        sx={{ p: 3 }}
      >
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Авторизация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <TextField 
              placeholder='Логин' 
              name='login' 
              value={login}
              onChange={e => setLogin(e.target.value)}  
            />
          </Stack> 

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Пароль:</Typography>
            <TextField 
              placeholder='Пароль'
              type='password'
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            /> 
          </Stack>

          <Stack direction='column' gap={1}>
            <Button type='submit' variant='contained'>Войти</Button>
            <Button onClick={() => navigate('/register')}>Регистрация</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;
