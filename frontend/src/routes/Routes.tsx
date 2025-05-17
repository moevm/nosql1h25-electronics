import { Routes, Route, Navigate } from 'react-router-dom';
import NotFoundPage from '@src/components/pages/NotFoundPage';
import { RegisterPage } from '@src/components/pages/RegisterPage';
import { LoginPage } from '@src/components/pages/LoginPage';
import ProductCardPage from '@src/components/pages/ProductCardPage';
import { AuthorizedOnly } from './AuthorizedOnly';
import { EditProfilePage } from '@src/components/pages/EditProfilePage';
import { ProductsPage } from '@src/components/pages/ProductsPage';
import StatisticsPage from '@src/components/pages/StatisticsPage';

const routes = [
  { path: '/products', element: <AuthorizedOnly><ProductsPage /></AuthorizedOnly> },
  { path: '/product/:id', element: <AuthorizedOnly><ProductCardPage /></AuthorizedOnly> },
  { path: '/statistics', element: <AuthorizedOnly><StatisticsPage /></AuthorizedOnly> },
  { path: '/profile', element: <AuthorizedOnly><EditProfilePage /></AuthorizedOnly> },
  { path: '/login', element: <AuthorizedOnly inverted><LoginPage /></AuthorizedOnly>},
  { path: '/register', element: <AuthorizedOnly inverted><RegisterPage /></AuthorizedOnly>},
  { path: '*', element: <NotFoundPage />,},
];

const AppRouter = () => (
  <Routes>
    {routes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
    <Route index element={<Navigate to='/products' replace />} />
  </Routes>
);

export default AppRouter;
