import { API, type ApiService } from '../api/Api';
import { EVENEMENT } from '../constants/Activities';
import { ROLE_BUREAU } from '../constants/Roles';
import { StorageKeys } from '../constants/StorageKeys';
import type { User } from '../model/User';
import type { UserPreferences } from '../model/UserPreferences';
import { fromActivityId } from '../utils/Utils';
import { StorageService } from './StorageService';
import type { Role } from '../model/Role.ts';
import type { ActivityId } from '../model/Activity.ts';

class SettingsService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async save(user: User): Promise<User> {
    await this.api.saveOrUpdateUser({
      id: user.id,
      name: user.name?.trim(),
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

  activityVisible(prefs: User | UserPreferences | null, activityId: ActivityId): boolean {
    if (prefs === null) {
      return true;
    }
    const activity = fromActivityId(activityId);
    if (activity?.id === EVENEMENT.id && this.hasRole(prefs, ROLE_BUREAU)) {
      return true;
    } else if (activity?.id !== EVENEMENT.id && !activity?.filterable) {
      return true;
    }
    if('activities' in prefs) {
      return !!prefs.activities && prefs.activities.indexOf(activityId) >= 0;
    }else if('preferences' in prefs) {
      return !!prefs.preferences?.activities && prefs.preferences.activities.indexOf(activityId) >= 0;
    }else{
      return false;
    }
  }

  hasRole(prefs: User | UserPreferences | undefined, role: Role): boolean {
    if (prefs === null || prefs === undefined) {
      return false;
    }
    if('roles' in prefs) {
      return !!prefs?.roles && prefs?.roles?.indexOf(role.id) >= 0;
    }else if('preferences' in prefs) {
      return !!prefs.preferences?.roles && prefs.preferences.roles?.indexOf(role.id) >= 0;
    }else{
      return false;
    }
  }
}

export const settingsService = new SettingsService(API);
