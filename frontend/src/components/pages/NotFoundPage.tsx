import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          404 страница не найдена
        </Typography>
        <Button variant="contained" component={Link} to="/">
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;