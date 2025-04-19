import { FormEvent, useState } from 'react';
import { Paper, Typography, TextField, Button, Stack, Container } from '@mui/material';
import { MuiTelInput, classes } from 'mui-tel-input';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { PasswordField } from '@src/components/ui/PasswordField';
import style from './RegisterPage.module.css';

const MuiTelInputNoFlag = styled(MuiTelInput)`
  .${classes.flagButton} {
    display: none;
  }
`;

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
      <Paper
        component='form'
        elevation={5}
        onSubmit={onSubmit}
        sx={{ p: 3 }}
      >
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Регистрация</Typography>

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
            <PasswordField 
              placeholder='Пароль'
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            /> 
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>ФИО:</Typography>
            <TextField 
              placeholder='Иванов Иван Иванович' 
              name='fullname' 
              value={fullname}
              onChange={e => setFullname(e.target.value)}
            /> 
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Номер телефона:</Typography>
            <MuiTelInputNoFlag 
              defaultCountry='RU' 
              disableDropdown
              forceCallingCode
              slotProps={{ htmlInput: { maxLength: 13 }}}
              value={phone}
              onChange={value => setPhone(value)}
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
