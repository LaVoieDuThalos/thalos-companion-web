import { createContext, useEffect, useState } from 'react';
import { StorageKeys } from '../constants/StorageKeys';
import type { User } from '../model/User';
import {
  AsyncStorageService,
  StorageService,
} from '../services/StorageService';
import { userService } from '../services/UserService';
import { uuid } from '../utils/Utils';

export interface UserContextType {
  user: User;
  loading: boolean;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType>({
  user: { id: '', name: '' },
  loading: false,
  setUser: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState(StorageService.getItem(StorageKeys.USER));
  const [loading, setLoading] = useState(false);

  // Exécutée au lancement de l'application
  useEffect(() => {
    setLoading(true);
    // Recherche le user local
    const getUserOrCreate = (userId: string): Promise<User> => {
      if (!userId) {
        // Aucun user local, on en crée un avec un UUID
        return userService.createUser({
          id: uuid(),
        });
      } else {
        // Synchro les infos du user local avec la bdd
        return userService.getUserById(userId).then((user) => {
          if (user === null) {
            // Pas de user remote, on le recrée depuis les données locales ?
            return AsyncStorageService.getItem(userId).then((user) => {
              if (user === null) {
                return userService.createUser({
                  id: uuid(),
                });
              } else {
                // Reprend les preferences locales
                return userService.createUser({ ...user, id: uuid() });
              }
            });
          } else {
            // User trouvé
            return Promise.resolve(user);
          }
        });
      }
    };

    AsyncStorageService.getItem(StorageKeys.USER)
      .then((user) => getUserOrCreate(user?.id))
      .then((user) => {
        StorageService.setItem(StorageKeys.USER, user);
        setUser(user);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Unable to find user', err);
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
