import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.scss';
import Alerts from './components/common/Alerts';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AlertContextProvider from './contexts/AlertsContext';
import AppContextProvider from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';

const headerHeight = 60;
const footerHeight = 80;

function App() {
  const [, setSize] = useState(
    window.innerHeight - headerHeight - footerHeight
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSize(window.innerHeight - headerHeight - footerHeight);
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <>
      <AppContextProvider>
        <UserContextProvider>
          <AlertContextProvider>
            <div>
              <Header />

              <Alerts />

              <div>
                <Outlet />
              </div>
              <Footer />
            </div>
          </AlertContextProvider>
        </UserContextProvider>
      </AppContextProvider>
    </>
  );
}

export default App;
