import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { User } from '../model/User';

export function useUser(): [User, (user: User) => void, boolean] {
  const userContext = useContext(UserContext);

  return [userContext.user, userContext.setUser, userContext.loading];
}
