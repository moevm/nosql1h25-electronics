import { Routes, Route } from 'react-router-dom';
import TestPage from '@src/components/pages/TestPage';
import NotFoundPage from '@src/components/pages/NotFoundPage';
import RegisterPage from '@src/components/pages/RegisterPage/RegisterPage';
import RequestsAdminPage from '@src/components/pages/RequestsAdminPage/RequestsAdminPage';
import RequestsClientPage from '@src/components/pages/RequestsClientPage';
import LoginPage from '@src/components/pages/LoginPage/LoginPage';

const AppRouter = () => (
  <Routes>
    <Route path='login' element={<LoginPage />} />
    <Route path='register' element={<RegisterPage />} />
    <Route path='requests' element={<RequestsAdminPage />} />
    <Route path='requestsClient' element={<RequestsClientPage />} />
    <Route path='test' element={<TestPage />} />

    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
