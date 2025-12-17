import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router';

import App from './App';
import HomePage from './app/Home/Home';
import KeysPage from './app/Keys/Keys';
import './index.scss';

import AboutPage from './app/AboutPage/AboutPage';
import EventDetailsPage from './app/events/EventDetails';
import GameDayPage from './app/GameDayPage/GameDayPage';
import KeyPage from './app/KeyPage/KeyPage';
import AgendaPage from './app/AgendaPage/AgendaPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App/>} children={[
          <Route path="/" element={<HomePage />} />,
          <Route path="/about" element={ <AboutPage />} />,
          <Route path="/agenda" children={[
            <Route path="/agenda" element={<AgendaPage />}/>,
            <Route path="/agenda/:dayId" element={<GameDayPage />}/>
          ]} />,
          <Route path="/keys" children={[
            <Route path="/keys" element={<KeysPage />}/>,
            <Route path="/keys/:keyId" element={<KeyPage />}/>,
          ]} />,
          <Route path="/events" children={[
            <Route path="/events/:eventId" element={<EventDetailsPage />}/>,
          ]}/>
        ]} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
