import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SmallInputsTheme } from '@src/components/themes/SmallInputs';
import 'dayjs/locale/ru';
import App from '@src/components/App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './main.css';
import { ThemeProvider } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <ThemeProvider theme={SmallInputsTheme}>
        <App />
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>,
);
