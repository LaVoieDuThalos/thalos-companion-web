import { API, type ApiService } from '../api/Api';
import type { User, UserId } from '../model/User';
import { toUser, toUsers } from '../api/mappers/Mappers.ts';
import type { UserDto } from '../api/dto/User.ts';

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
    return this.api.findUserByName(name, excludeUserIds).then(toUsers);
  }

  getUserById(userId: UserId): Promise<User | null> {
    return this.api.findUserById(userId).then(toUser);
  }

  createUser(user: UserDto): Promise<User> {
    return this.api.saveOrUpdateUser(user).then(toUser);
  }

  findAllUsers(withEmptyName = true): Promise<User[]> {
    return this.api.findAllUsers(withEmptyName).then(toUsers);
  }
}

export const userService = new UserService(API);
