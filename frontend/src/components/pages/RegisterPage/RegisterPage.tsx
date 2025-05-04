import { Paper, Typography, Button, Stack, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PasswordFormField, TextFormField } from '@src/components/ui/FormFields';
import style from './RegisterPage.module.css';
import { useState } from 'react';
import { ApiError, AuthService } from '@src/api';
import PhoneField from '@src/components/ui/PhoneField';

interface FormInputs {
  login: string;
  password: string;
  fullname: string;
  phone: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<FormInputs>();

  const [isRegistering, setIsRegistering] = useState(false);

  const onSubmit = async (data: FormInputs) => {
    setIsRegistering(true);

    try {
      await AuthService.authRegisterCreate({
        requestBody: {
          fullname: data.fullname,
          login: data.login,
          password: data.password,
          phone: data.phone.replace(/[ ()-]/g, ''),
        },
      });

      navigate('/login');
    } catch (e) {
      if (!(e instanceof ApiError)) 
        setError('login', { message: 'Неизвестная ошибка' });
      else if (e.body?.details && e.body.details.startsWith('login')) 
        setError('login', { message: 'Логин уже занят' });
      else if (e.body?.details && e.body.details.startsWith('phone'))
        setError('phone', { message: 'Нормер телефона уже занят' });
      else 
        setError('login', { message: 'Неизвестная ошибка' });
    }

    setIsRegistering(false);
  };

  return (
    <Container maxWidth='sm' className={style.container}>
      <Paper elevation={5} sx={{ p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Регистрация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <TextFormField placeholder='Логин' minLength={3} maxLength={50} required name='login' control={control}/>
          </Stack> 

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Пароль:</Typography>
            <PasswordFormField placeholder='Пароль' minLength={8} maxLength={50} name='password' control={control} />
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>ФИО:</Typography>
            <TextFormField placeholder='ФИО' maxLength={200} required name='fullname' control={control} />
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Номер телефона:</Typography>
            <PhoneField required name='phone' control={control} />
          </Stack>

          <Stack direction='column' gap={1}>
            <Button variant='contained' onClick={handleSubmit(onSubmit)} disabled={isRegistering}>
              { isRegistering ? <CircularProgress size={25} /> : 'Зарегистрироваться' }
            </Button>
            <Button onClick={() => navigate('/login')}>Авторизация</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
