import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { User } from '../model/User';
import { settingsService } from '../services/SettingsService.ts';
import type { Role } from '../constants/Roles.ts';

export function useUser(): {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  hasRole: (role: Role) => boolean;
  activityVisible: (activityId: string) => boolean;
} {
  const userContext = useContext(UserContext);
  const hasRole = (role: Role) => settingsService.hasRole(userContext.user, role);
  const activityVisible = (activityId: string) => settingsService.activityVisible(userContext.user, activityId);
  return { ...userContext, hasRole, activityVisible };
}
