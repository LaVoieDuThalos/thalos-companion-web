import { API, type ApiService } from '../api/Api';
import type { Role } from '../constants/Roles';
import { StorageKeys } from '../constants/StorageKeys';
import type { User } from '../model/User';
import type { UserPreferences } from '../model/UserPreferences';
import { StorageService } from './StorageService';

class SettingsService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async save(user: Partial<User>): Promise<User> {
    await this.api.saveOrUpdateUser({
      id: user.id,
      name: user.name,
      preferences: { ...user.preferences },
    } as User);

    StorageService.setItem(StorageKeys.USER, user);

    const saved = await this.get();
    if (saved === null) {
      return Promise.reject('No prefs');
    } else {
      return Promise.resolve(saved);
    }
  }

  async get(): Promise<User | null> {
    const saved = StorageService.getItem(StorageKeys.USER);
    if (saved) {
      return Promise.resolve(saved as User);
    } else {
      return Promise.resolve(null);
    }
  }

  activityVisible(prefs: UserPreferences | null, activityId: string): boolean {
    if (prefs === null) {
      return true;
    }
    return !!prefs.activities && prefs.activities.indexOf(activityId) >= 0;
  }

  hasRole(prefs: UserPreferences | null, role: Role): boolean {
    if (prefs === null) {
      return false;
    }
    return !!prefs.roles && prefs.roles?.indexOf(role.id) >= 0;
  }
}

export const settingsService = new SettingsService(API);
