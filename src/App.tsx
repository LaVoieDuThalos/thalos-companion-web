import { Outlet } from 'react-router-dom';
import './App.scss';
import Alerts from './components/common/Alerts';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AlertContextProvider from './contexts/AlertsContext';
import AppContextProvider from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';
import { ErrorBoundary } from 'react-error-boundary';
import { type ErrorInfo } from 'react';
import { ErrorPage } from './app/ErrorPage/ErrorPage.tsx';

function App() {
  const handleError = (error: unknown, info: ErrorInfo) => {
    console.error('Error caught in ErrorBoundary:', error, info);
  };

  return (
    <>
      <ErrorBoundary onError={handleError} FallbackComponent={ErrorPage}>
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
      </ErrorBoundary>
    </>
  );
}

export default App;
