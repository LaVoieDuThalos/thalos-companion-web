import type { ActivityId } from './Activity.ts';
import type { RoleId } from './Role.ts';

export interface UserPreferences {
  activities?: ActivityId[];
  roles?: RoleId[];
}
