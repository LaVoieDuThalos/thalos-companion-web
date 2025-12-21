import type { Activity } from './Activity';
import type { GameDay } from './GameDay';
import type { Room } from './Room';
import type { User } from './User';

export type LastModification = {
  date: string;
  user: Partial<User>;
};

export type EventSubscriptionStatus = 'validated' | 'cancelled' | 'waiting';

export type EventSubscription = {
  id: string;
  eventId: string;
  user: Partial<User>;
  name?: string;
  subscribedAt: string;
  status?: EventSubscriptionStatus;
};

export type EventSubscriptionModes = 'auto' | 'manual';

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
  otherRoomName?: string;
  otherRoomAddress?: string;
  otherRoomMapUrl?: string;
  room?: Room;
  gameMaster?: string;
  tables?: number;
  activityId?: string;
  activity?: Activity;
  description?: string;
  creator?: Partial<User>;
  lastModification?: LastModification;
  discordChannel?: string;
  img?: string;
  withSubscriptions?: boolean;
  maxSubscriptions?: number;
  subscriptionMode?: EventSubscriptionModes;
}
