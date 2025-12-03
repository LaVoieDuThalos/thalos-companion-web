import { useContext } from 'react';
import { findRoleById, type Role } from '../constants/Roles.ts';
import { UserContext } from '../contexts/UserContext';
import type { User } from '../model/User';
import { settingsService } from '../services/SettingsService.ts';

export function useUser(): {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  hasRole: (role: Role) => boolean;
  hasRoleReferent: (activityId: string) => boolean;
  activityVisible: (activityId: string) => boolean;
} {
  const userContext = useContext(UserContext);
  const hasRole = (role: Role) =>
    settingsService.hasRole(userContext.user, role);
  const hasRoleReferent = (activityId: string) => {
    const roleReferent = findRoleById('referent.' + activityId);
    if (roleReferent !== undefined) {
      return settingsService.hasRole(userContext.user, roleReferent);
    } else {
      return false;
    }
  };
  const activityVisible = (activityId: string) =>
    settingsService.activityVisible(userContext.user, activityId);
  return { ...userContext, hasRole, activityVisible, hasRoleReferent };
}
