import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import App from './App';
import HomePage from './app/Home/Home';
import KeysPage from './app/Keys/Keys';
import './index.scss';

import AboutPage from './app/AboutPage/AboutPage';
import AgendaPage from './app/Agenda';
import EventDetailsPage from './app/events/EventDetails';
import GameDayPage from './app/GameDayPage/GameDayPage';
import KeyPage from './app/KeyPage/KeyPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/about',
          element: <AboutPage />,
        },
        {
          path: '/agenda',
          children: [
            {
              path: '/agenda/',
              element: <AgendaPage />,
            },
            {
              path: '/agenda/:dayId',
              element: <GameDayPage />,
            },
          ],
        },
        {
          path: '/keys',
          children: [
            {
              path: '/keys',
              element: <KeysPage />,
            },
            {
              path: '/keys/:keyId',
              element: <KeyPage />,
            },
          ],
        },
        {
          path: '/events',
          children: [
            {
              path: '/events/:eventId',
              element: <EventDetailsPage />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
