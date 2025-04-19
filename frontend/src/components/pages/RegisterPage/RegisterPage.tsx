import { Paper, Typography, Button, Stack, Container } from '@mui/material';
import { MuiTelInput, classes } from 'mui-tel-input';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Control, Controller, useForm } from 'react-hook-form';
import { PasswordFormField, TextFormField } from '@src/components/ui/FormFields';
import style from './RegisterPage.module.css';

interface FormInputs {
  login: string;
  password: string;
  fullname: string;
  phone: string;
}

interface FormFieldProps {
  control: Control<FormInputs>;
}

const MuiTelInputNoFlag = styled(MuiTelInput)`
  .${classes.flagButton} {
    display: none;
  }
`;

const PhoneFormField = ({ control }: FormFieldProps) => (
  <Controller 
    name='phone'
    control={control}
    render={({ field, fieldState }) => (
      <MuiTelInputNoFlag 
        defaultCountry='RU'
        disableDropdown
        forceCallingCode
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
          if (value.replace(/\s/g, '').length !== 12) return 'Некорректный номер';          
        },
      },
    }}
  />
);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    alert(JSON.stringify(data));
  };

  return (
    <Container maxWidth='sm' className={style.container}>
      <Paper elevation={5} sx={{ p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Регистрация</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Логин:</Typography>
            <TextFormField placeholder='Логин' name='login' control={control}/>
          </Stack> 

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Пароль:</Typography>
            <PasswordFormField placeholder='Пароль' name='password' control={control} />
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>ФИО:</Typography>
            <TextFormField placeholder='ФИО' name='fullname' control={control} />
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Номер телефона:</Typography>
            <PhoneFormField control={control} />
          </Stack>

          <Stack direction='column' gap={1}>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>Зарегистрироваться</Button>
            <Button onClick={() => navigate('/login')}>Авторизация</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
