import { API, type ApiService } from '../api/Api';
import type { User, UserId } from '../model/User';

class UserService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  findUserByName(
    name: string | undefined,
    excludeUserIds: UserId[] = []
  ): Promise<User[]> {
    if (!name) {
      return Promise.reject('Name not provided');
    }
    return this.api.findUserByName(name, excludeUserIds);
  }

  getUserById(userId: UserId): Promise<User | null> {
    return this.api.findUserById(userId);
  }

  createUser(user: User): Promise<User> {
    return this.api.saveOrUpdateUser(user);
  }

  findAllUsers(withEmptyName = true): Promise<User[]> {
    return this.api.findAllUsers(withEmptyName);
  }
}

export const userService = new UserService(API);
