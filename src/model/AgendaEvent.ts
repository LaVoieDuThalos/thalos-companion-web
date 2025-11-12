import type { Activity } from './Activity';
import type { GameDay } from './GameDay';
import type { Room } from './Room';
import type { User } from './User';

export type EventModification = {
  user: {
    id: string;
    name: string;
  };
  date: string;
};

export interface AgendaEvent {
  id: string;
  title: string;
  dayId?: string;
  day: GameDay;
  start: string;
  durationInMinutes: number;
  startTime?: number;
  endTime?: number;
  roomId?: string;
  room?: Room;
  tables?: number;
  activityId?: string;
  activity?: Activity;
  imageUrl?: string;
  description?: string;
  creator?: Partial<User>;
  lastModification?: EventModification;
}
