import { Paper, Typography, Button, Stack, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PasswordFormField, TextFormField } from '@src/components/ui/FormFields';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { login, selectIsAuthorized } from '@src/store/UserSlice';
import { useEffect } from 'react';
import style from './LoginPage.module.css';

interface FormInputs {
  login: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<FormInputs>();

  const dispatch = useAppDispatch();
  const isAuthorizing = useAppSelector(state => state.user.isAuthorizing);
  const authError = useAppSelector(state => state.user.error);
  const isAuthorized = useAppSelector(selectIsAuthorized);

  useEffect(() => {
    if (!authError) return;
    setError('login', { message: authError });
  }, [authError]);

  if (isAuthorized) navigate('/requests/client', { replace: true });

  const onSubmit = (data: FormInputs) => dispatch(login(data));

  return (
    <Container maxWidth='xs' className={style.container}>
      <Paper elevation={5} sx={{ p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Авторизация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <TextFormField placeholder='Логин' minLength={3} maxLength={50} required name='login' control={control} />
          </Stack> 

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Пароль:</Typography>
            <PasswordFormField placeholder='Пароль' maxLength={50} name='password' control={control} /> 
          </Stack>

          <Stack direction='column' gap={1}>
            <Button variant='contained' onClick={handleSubmit(onSubmit)} disabled={isAuthorizing}>
              { isAuthorizing ? <CircularProgress size={25} /> : 'Войти' }
            </Button>
            <Button onClick={() => navigate('/register')}>Регистрация</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;
