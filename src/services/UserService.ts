import { API, type ApiService } from '../api/Api';
import { StorageKeys } from '../constants/StorageKeys';
import type { User } from '../model/User';
import { uuid } from '../utils/Utils';
import { AsyncStorageService } from './StorageService';

class UserService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  getUserId(): Promise<string> {
    return AsyncStorageService.getItem(StorageKeys.USER).then((userId) => {
      if (userId === null) {
        const newUserId = uuid();
        return AsyncStorageService.setItem(StorageKeys.USER, newUserId).then(
          () => {
            console.log('Create new UUID user', newUserId);
            Promise.resolve(newUserId);
          }
        );
      } else {
        console.log('Use UUID', userId);
        return Promise.resolve(userId);
      }
    });
  }

  getUserById(userId: string): Promise<User | null> {
    return this.api.findUserById(userId);
  }

  createUser(user: User): Promise<User> {
    return this.api.saveOrUpdateUser(user);
  }

  updateUser(user: User): Promise<User> {
    if (!user.id) {
      throw Error('User id undefined. Cannot update');
    }
    return this.api.saveOrUpdateUser(user);
  }

  findAllUsers(): Promise<User[]> {
    return this.api.findAllUsers();
  }
}

export const userService = new UserService(API);
