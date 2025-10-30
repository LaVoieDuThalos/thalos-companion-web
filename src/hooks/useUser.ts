import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { User } from '../model/User';

export function useUser(): {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
} {
  const userContext = useContext(UserContext);
  return { ...userContext };
}
