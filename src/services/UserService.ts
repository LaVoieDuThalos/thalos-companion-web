import { API, type ApiService } from '../api/Api';
import { StorageKeys } from '../constants/StorageKeys';
import type { User } from '../model/User';
import { uuid } from '../utils/Utils';
import { StorageService } from './StorageService';

class UserService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  getUserId(): Promise<string> {
    return StorageService.getItem(StorageKeys.USER_ID).then((userId) => {
      if (userId === null) {
        const newUserId = uuid();
        return StorageService.setItem(StorageKeys.USER_ID, newUserId).then(() =>
          Promise.resolve(newUserId)
        );
      } else {
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

  findAllUsers(): Promise<User[]> {
    return this.api.findAllUsers();
  }
}

export const userService = new UserService(API);
