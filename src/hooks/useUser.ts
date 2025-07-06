import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import type { User } from '../model/User';
import { userService } from '../services/UserService';
import { isNotEmpty } from '../utils/Utils';

export function useUser(): User | null {
  const appContext = useContext(AppContext);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (appContext.user && isNotEmpty(appContext.user.id)) {
      setUser(appContext.user);
    } else {
      userService
        .getUserId()
        .then((userId) =>
          userService
            .getUserById(userId)
            .then((existing) => Promise.resolve({ existing, userId }))
        )
        .then(({ existing, userId }) => {
          if (existing === null) {
            try {
              return userService.createUser({
                id: userId,
              } as User);
            } catch (error) {
              console.error(error);
              return { id: userId } as User;
            }
          } else {
            return Promise.resolve(existing);
          }
        })
        .then((user) => {
          appContext.setUser(user);
          setUser(user);
        });
    }
  }, []);

  return user;
}
