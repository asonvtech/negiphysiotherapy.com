import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './ui/layout/AppLayout';
import { HomePage } from './views/HomePage';
import { NotFoundPage } from './views/NotFoundPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
