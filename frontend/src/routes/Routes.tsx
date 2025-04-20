import { Routes, Route } from 'react-router-dom';
import TestPage from '@src/components/pages/TestPage';
import NotFoundPage from '@src/components/pages/NotFoundPage';
import RegisterPage from '@src/components/pages/RegisterPage/RegisterPage';
import RequestsAdminPage from '@src/components/pages/RequestsAdminPage';
import RequestsClientPage from '@src/components/pages/RequestsClientPage';
import LoginPage from '@src/components/pages/LoginPage/LoginPage';
import ProductCardPage from '../components/pages/ProductCardPage';
import ProductCreateDialogExample from '../components/pages/ProductCreateDialogExample';

const routes = [
  { path: '/product/:id', element: <ProductCardPage /> },
  { path: '/product-dialog', element: <ProductCreateDialogExample/>},
  { path: '/login', element: <LoginPage/>},
  { path: '/register', element: <RegisterPage/>},
  { path: '/requests/admin', element: <RequestsAdminPage/>},
  { path: '/requests/client', element: <RequestsClientPage/>},
  { path: '/test', element: <TestPage/>,},
  { path: '*', element: <NotFoundPage/>,},
];

const AppRouter = () => (
  <Routes>
    {routes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Routes>
);

export default AppRouter;
