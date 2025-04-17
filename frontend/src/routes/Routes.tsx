import { Routes, Route } from 'react-router-dom';
import TestPage from '../components/pages/TestPage';
import NotFoundPage from '../components/pages/NotFoundPage';

const routes = [
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