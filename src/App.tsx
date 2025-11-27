import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.scss';
import Alerts from './components/common/Alerts';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AlertContextProvider from './contexts/AlertsContext';
import AppContextProvider from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';

const headerHeight = 54;
const footerHeight = 38;

function App() {
  const [size, setSize] = useState(
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
            <div className="content">
              <Header />

              <Alerts />

              <div
                className="outlet"
                style={{
                  height: size,
                }}
              >
                <Outlet />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: size + 55,
                  width: '100%',
                  maxWidth: 1280,
                }}
              >
                <Footer />
              </div>
            </div>
          </AlertContextProvider>
        </UserContextProvider>
      </AppContextProvider>
    </>
  );
}

export default App;
