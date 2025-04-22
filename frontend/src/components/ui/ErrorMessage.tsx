import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export type ErrorProps = {
  title?: string;
  message?: string;
  showBackButton?: boolean;
};

const ErrorMessage = ({
  title = 'Упс! Что-то пошло не так.',
  message = 'Произошла непредвиденная ошибка. Попробуйте позже.',
  showBackButton = true,
}: ErrorProps) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {message}
        </Typography>
        {showBackButton && (
          <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 4 }}>
            Назад
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ErrorMessage;
