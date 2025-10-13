import type { UserPreferences } from './UserPreferences';

export interface User {
  id: string;
  name?: string;
  isNew?: boolean;
  preferences?: UserPreferences;
}
