import { Routes, Route } from 'react-router-dom';
import TestPage from '../components/pages/TestPage';
import NotFoundPage from '../components/pages/NotFoundPage';
import ProductCardPage from '../components/pages/ProductCardPage';
import ProductCreateDialogExample from '../components/pages/ProductCreateDialogExample';

const routes = [
  { path: '/product/:id', element: <ProductCardPage /> },
  { path: '/product-dialog', element: <ProductCreateDialogExample/>},
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