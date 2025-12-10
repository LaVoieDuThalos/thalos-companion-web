import type { UserPreferences } from './UserPreferences';

export interface User {
  id: UserId;
  name?: string;
  isNew?: boolean;
  preferences?: UserPreferences;
}

export type ShortUser = Pick<User, 'id' | 'name'>;

export type UserId = string;