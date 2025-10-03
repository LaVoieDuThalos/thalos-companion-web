import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.scss';
import Alerts from './components/common/Alerts';
import Backdrop from './components/common/Backdrop';
import Footer from './components/Footer';
import Header from './components/Header';
import {
  AlertContext,
  type Alert,
  type AlertContextProps,
} from './contexts/AlertsContext';
import { AppContext, type AppContextProps } from './contexts/AppContext';
import type { User } from './model/User';

const headerHeight = 60;
const footerHeight = 80;

function App() {
  const [size, setSize] = useState(
    window.innerHeight - headerHeight - footerHeight
  );

  const [loading, setLoading] = useState(false);

  const [appContext, setAppContext] = useState<AppContextProps>({
    loading: false,
    setLoading: (loading) => setLoading(loading),
    refreshs: {},
    refresh: (key: string) => {
      setAppContext((prev) => {
        return {
          ...prev,
          refreshs: { ...prev.refreshs, [key]: new Date().toISOString() },
        };
      });
    },
    setUser: (user: User) => {
      setAppContext((prev) => ({
        ...prev,
        user,
      }));
    },
  });

  const [alertContext, setAlertContext] = useState<AlertContextProps>({
    alert: (a: Alert) => {
      setAlertContext((prev) => ({ ...prev, currentAlert: a }));
    },
    dialog: (title, message, actions) => {
      const a: Alert = {
        title,
        message,
        actions,
      };
      setAlertContext((prev) => ({ ...prev, currentAlert: a }));
    },
    reset: () => {
      setAlertContext((prev) => ({ ...prev, currentAlert: undefined }));
    },
  });

  useEffect(() => {
    const resizeHandler = () => {
      setSize(window.innerHeight - headerHeight - footerHeight);
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <>
      <AppContext.Provider value={appContext}>
        <AlertContext.Provider value={alertContext}>
          <div style={{}}>
            {loading ? <Backdrop /> : null}

            <Header />

            <Alerts />

            <div style={{}}>
              <Outlet />
            </div>
            <Footer />
          </div>
        </AlertContext.Provider>
      </AppContext.Provider>
    </>
  );
}

export default App;
