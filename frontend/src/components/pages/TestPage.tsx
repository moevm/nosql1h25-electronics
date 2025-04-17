import { Box, Button, Container, Typography } from "@mui/material";
import { useState } from "react";

const TestPage = () => {
    const [count, setCount] = useState(0);
  
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Тестовая страница с Material UI
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Вы нажали кнопку {count} раз(а).
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount(count + 1)}
          >
            Нажми меня
          </Button>
        </Box>
      </Container>
    );
  };
  
  export default TestPage;