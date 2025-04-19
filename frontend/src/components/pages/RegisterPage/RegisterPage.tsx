import { FormEvent, useState } from 'react';
import { Paper, Typography, TextField, Button, Stack, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import style from './RegisterPage.module.css';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Container maxWidth='sm' className={style.container}>
      <Paper component='form' elevation={5} onSubmit={onSubmit} sx={{ mt: 3, p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Регистрация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <TextField
              placeholder='Логин'
              name='login' 
              required
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
              slotProps={{ htmlInput: { minLength: 8, maxLength: 50 }}} 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            /> 
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>ФИО:</Typography>
            <TextField 
              placeholder='Иванов Иван Иванович' 
              name='fullname' 
              slotProps={{ htmlInput: { minLength: 1, maxLength: 200 }}}  
              required 
              value={fullname}
              onChange={e => setFullname(e.target.value)}
            /> 
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Номер телефона:</Typography>
            <TextField 
              placeholder='+x(xxx)xxx-xx-xx' 
              slotProps={{ htmlInput: { pattern: '\\+\\d\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}' }}} 
              type='tel' 
              name='phone' 
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
            /> 
          </Stack>

          <Stack direction='column' gap={1}>
            <Button type='submit' variant='contained'>Зарегистрироваться</Button>
            <Button onClick={() => navigate('/login')}>Авторизация</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
