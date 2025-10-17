import { createContext, useState, type ReactNode } from 'react';
import type { User } from '../model/User';

export type ActionPayload = unknown;

export type AppState = { [key: string]: unknown };

export type AppContextProps = {
  user?: User;
  refreshs: { [key: string]: string };
  refresh: (key: string) => void;
  setUser: (user: User) => void;
};
export const AppContext = createContext<AppContextProps>({
  refreshs: {},
  refresh: () => {},
  setUser: () => {},
});

export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [appContext, setAppContext] = useState<AppContextProps>({
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
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
