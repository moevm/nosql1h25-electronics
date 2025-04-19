import { Paper, Typography, TextField, Button, Stack, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Control, Controller, useForm } from 'react-hook-form';
import { PasswordField } from '@src/components/ui/PasswordField';
import style from './LoginPage.module.css';

interface FormInputs {
  login: string;
  password: string;
}

interface FormFieldProps {
  control: Control<FormInputs>;
}

const LoginFormField = ({ control }: FormFieldProps) => (
  <Controller
    name='login'
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        placeholder='Логин'
        helperText={fieldState.error?.message}
        error={!!fieldState.error}
        value={field.value}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: {
        required: (value: string) => {
          if (!value) return 'Обязательное поле';
          if (!value.trim()) return 'Поле не может быть пустым';
        },
      },
    }}
  />
);

const PasswordFormField = ({ control }: FormFieldProps) => (
  <Controller 
    name='password'
    control={control}
    render={({ field, fieldState }) => (
      <PasswordField 
        placeholder='Пароль'
        helperText={fieldState.error?.message}
        error={!!fieldState.error}
        value={field.value}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: {
        required: (value: string) => {
          if (!value) return 'Обязательное поле';
        },
      },
    }}
  />
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    alert(JSON.stringify(data));    
  };

  return (
    <Container maxWidth='xs' className={style.container}>
      <Paper elevation={5} sx={{ p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Авторизация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <LoginFormField control={control} />
          </Stack> 

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Пароль:</Typography>
            <PasswordFormField control={control} /> 
          </Stack>

          <Stack direction='column' gap={1}>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>Войти</Button>
            <Button onClick={() => navigate('/register')}>Регистрация</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;
