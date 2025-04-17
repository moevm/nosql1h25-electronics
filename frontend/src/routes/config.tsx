import NotFoundPage from "../components/pages/NotFoundPage";
import TestPage from "../components/pages/TestPage";

export const routes = [
  { path: '/test', element: <TestPage/>,},
  { path: '*', element: <NotFoundPage/>,},
];