import { Paper, Typography, Button, Stack, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextFormField } from '@src/components/ui/form/TextFormField';
import { PasswordFormField } from '@src/components/ui/form/PasswordFormField';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { login, selectIsAuthorizing } from '@src/store/UserSlice';
import { useEffect } from 'react';

export interface LoginFormInputs {
  login: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<LoginFormInputs>();

  const dispatch = useAppDispatch();
  const isAuthorizing = useAppSelector(selectIsAuthorizing);
  const authError = useAppSelector(state => state.user.error);

  useEffect(() => {
    if (!authError) return;
    setError('login', { message: authError });
  }, [authError]);

  const onSubmit = (data: LoginFormInputs) => dispatch(login(data));

  return (
    <Container
      maxWidth='xs'
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={5} sx={{ p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Авторизация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <TextFormField placeholder='Логин' maxLength={50} required prohibitBlank name='login' control={control} />
          </Stack> 

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Пароль:</Typography>
            <PasswordFormField placeholder='Пароль' maxLength={50} required name='password' control={control} /> 
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
