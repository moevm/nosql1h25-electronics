import { Button, CircularProgress, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextFormField } from '@src/components/ui/form/TextFormField';
import { PhoneFormField } from '@src/components/ui/form/PhoneFormField';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { editUser, selectIsAdmin, selectUser } from '@src/store/UserSlice';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from '@mui/lab';
import { Add, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';

export interface EditProfileFormInputs {
  fullname: string;
  phone: string;
}

const ProfileTimeline = () => {
  const { creation_date, edit_date } = useAppSelector(selectUser)!;
  const accountWasEdited = edit_date && edit_date !== creation_date;

  return (
    <Timeline sx={{
      [`& .${timelineItemClasses.root}:before`]: {
        flex: 0,
        padding: 0,
      },
      display: 'flex',
      alignContent: 'center',
      flexWrap: 'wrap',
    }}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot>
            <Add />
          </TimelineDot>
          {accountWasEdited && <TimelineConnector/>}
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant='body2' color='textSecondary'>
            {dayjs(creation_date).format('HH:mm DD.MM.YYYY')}
          </Typography>
          <Typography>Аккаунт <strong>создан</strong></Typography>
        </TimelineContent>
      </TimelineItem>

      {accountWasEdited &&
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <Edit />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant='body2' color='textSecondary'>
              {dayjs(edit_date).format('HH:mm  DD.MM.YYYY')}
            </Typography>
            <Typography>Данные аккаунта <strong>изменены</strong></Typography>
          </TimelineContent>
        </TimelineItem>
      }
    </Timeline>
  );
};

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, reset, setError } = useForm<EditProfileFormInputs>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(selectIsAdmin);
  const user = useAppSelector(selectUser)!;

  // https://github.com/orgs/react-hook-form/discussions/8888#discussioncomment-3446572
  const initUserData = () => {
    const { fullname, phone } = user;
    reset({ fullname, phone });
  };
  useLayoutEffect(initUserData, []);
  useEffect(initUserData, []);

  const onSubmit = async (data: EditProfileFormInputs) => {
    data.phone = data.phone.replace(/\s/g, '');

    if (user.fullname === data.fullname && user.phone === data.phone) {
      navigate(-1);
      return;
    }

    setIsSubmitting(true);
    
    const result = await dispatch(editUser(data));
    if (result.type.endsWith('rejected')) {
      if (result.payload === 'Номер телефона уже занят')
        setError('phone', { message: result.payload as string });
      else
        setError('fullname', { message: result.payload as string });
    } else {
      navigate(-1);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Container maxWidth='sm'>
      <Paper elevation={5} sx={{ mt: 3, p: 3 }}>
        <Stack direction='column' gap={2}>
          <Typography variant='h4'>Профиль</Typography>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>ФИО:</Typography>
            <TextFormField required placeholder="ФИО" maxLength={200} name='fullname' control={control} />
          </Stack>

          <Stack direction='column' gap={0}>
            <Typography variant='body1'>Номер телефона:</Typography>
            <PhoneFormField required name='phone' control={control} />
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

      <ProfileTimeline />
    </Container>
  );
};

export default EditProfilePage;
