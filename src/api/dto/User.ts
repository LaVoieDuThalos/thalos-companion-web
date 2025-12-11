export interface UserDto {
  id: string;
  name: string;
  preferences: {
    activities: string[];
    roles: string[]
  }
}