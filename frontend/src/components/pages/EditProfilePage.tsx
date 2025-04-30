import { Button, CircularProgress, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextFormField } from '@src/components/ui/FormFields';
import PhoneField from '@src/components/ui/PhoneField';
import { useAppSelector } from '@src/hooks/ReduxHooks';
import { selectIsAdmin } from '@src/store/UserSlice';

interface EditProfileFormInputs {
  fullname?: string;
  phone?: string;
}

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<EditProfileFormInputs>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = useAppSelector(selectIsAdmin);

  const onSubmit = async (data: EditProfileFormInputs) => {
    setIsSubmitting(true);
    alert(JSON.stringify(data));
    setIsSubmitting(false);
    navigate(-1);
  };

  return (
    <Container maxWidth='sm'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Профиль</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>ФИО:</Typography>
            <TextFormField placeholder="ФИО" maxLength={200} name='fullname' control={control} />
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Номер телефона:</Typography>
            <PhoneField name='phone' control={control} />
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Роль:</Typography>
            <TextField 
              value={isAdmin ? 'Администратор' : 'Пользователь'} 
              slotProps={{ htmlInput: { readOnly: true }}}
            />
          </Stack>

          <Stack direction='column' gap={1}>
            <Button variant='contained' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              { isSubmitting ? <CircularProgress size={25} /> : 'Сохранить изменения' }
            </Button>
            <Button onClick={() => navigate(-1)}>Отмена</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;
