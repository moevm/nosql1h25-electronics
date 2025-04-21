import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SmallInputsTheme } from '@src/components/themes/SmallInputs';
import 'dayjs/locale/ru';
import { store } from '@src/store/Store';
import { Provider } from 'react-redux';
import App from '@src/components/App';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThemeProvider } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <ThemeProvider theme={SmallInputsTheme}>
          <Provider store={store}>
            <App />
          </Provider>
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>,
);
