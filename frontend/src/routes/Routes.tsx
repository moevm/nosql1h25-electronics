import { Routes, Route, Navigate } from 'react-router-dom';
import NotFoundPage from '@src/components/pages/NotFoundPage';
import RegisterPage from '@src/components/pages/RegisterPage/RegisterPage';
import RequestsAdminPage from '@src/components/pages/RequestsAdminPage';
import RequestsClientPage from '@src/components/pages/RequestsClientPage';
import LoginPage from '@src/components/pages/LoginPage/LoginPage';
import ProductCardPage from '../components/pages/ProductCardPage';
import AuthorizedOnly from './AuthorizedOnly';
import ClientOnly from './ClientOnly';
import AdminOnly from './AdminOnly';
import { useAppSelector } from '@src/hooks/ReduxHooks';
import { selectIsAdmin } from '@src/store/UserSlice';
import { EditProfilePage } from '@src/components/pages/EditProfilePage';

const routes = [
  { path: '/product/:id', element: <AuthorizedOnly><ProductCardPage /></AuthorizedOnly> },
  { path: '/profile', element: <AuthorizedOnly><EditProfilePage /></AuthorizedOnly> },
  { path: '/login', element: <AuthorizedOnly inverted><LoginPage/></AuthorizedOnly>},
  { path: '/register', element: <AuthorizedOnly inverted><RegisterPage/></AuthorizedOnly>},
  { path: '*', element: <NotFoundPage/>,},
];

const AppRouter = () => {
  const isAdmin = useAppSelector(selectIsAdmin);
  
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      <Route index element={<Navigate to='/login' replace />} />
      <Route path='/requests' element={
        isAdmin
        ? <AdminOnly><RequestsAdminPage/></AdminOnly>
        : <ClientOnly><RequestsClientPage/></ClientOnly>
      } />
    </Routes>
  );
};

export default AppRouter;
