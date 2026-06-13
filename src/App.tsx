import { Outlet } from 'react-router-dom';
import './App.scss';
import Alerts from './components/common/Alerts';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AlertContextProvider from './contexts/AlertsContext';
import AppContextProvider from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';

function App() {
  return (
    <>
      <AppContextProvider>
        <UserContextProvider>
          <AlertContextProvider>
            <div className="content">
              <Header />
              <Alerts />
              <div className="outlet">
                <Outlet />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
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
