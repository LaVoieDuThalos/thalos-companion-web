import { createContext, useState } from 'react';
import type { User } from '../model/User';

export type ActionPayload = unknown;

export type AppState = { [key: string]: unknown };

export type AppContextProps = {
  user?: User;
  refreshs: { [key: string]: string };
  loading?: boolean;
  setLoading: (loading: boolean) => void;
  refresh: (key: string) => void;
  setUser: (user: User) => void;
};
export const AppContext = createContext<AppContextProps>({
  loading: false,
  setLoading: () => {},
  refreshs: {},
  refresh: () => {},
  setUser: () => {},
});

export default function AppContextProvider({ children }) {
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

  return (
    <AppContext.Provider value={appContext}>
      {loading ? 'Veuillez patienter...' : children}
    </AppContext.Provider>
  );
}
