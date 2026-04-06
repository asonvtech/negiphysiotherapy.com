import { createBrowserRouter } from 'react-router-dom';
import { ClinicLandingPage } from './pages/ClinicLandingPage';
import { NotFoundPage } from './views/NotFoundPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ClinicLandingPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
