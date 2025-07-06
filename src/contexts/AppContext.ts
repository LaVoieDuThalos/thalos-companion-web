import { createContext } from 'react';
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
