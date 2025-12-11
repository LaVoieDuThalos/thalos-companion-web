import type { Activity, ActivityId } from './Activity';
import type { GameDay, GameDayId } from './GameDay';
import type { Room, RoomId } from './Room';
import type { ShortUser } from './User';

export type LastModification = {
  date: string;
  user: ShortUser;
};

export type EventSubscriptionId = string;

export type EventSubscriptionStatus = 'validated' | 'cancelled' | 'waiting';

export type EventSubscriptionDate = string;

export type EventSubscription = {
  id: EventSubscriptionId;
  eventId: AgendaEventId;
  user: ShortUser;
  name?: string;
  subscribedAt: EventSubscriptionDate;
  status?: EventSubscriptionStatus;
};

export type EventSubscriptionModes = 'auto' | 'manual';

export interface AgendaEvent {
  id: AgendaEventId;
  title: AgendaEventTitle;
  dayId?: GameDayId;
  day: GameDay;
  start: AgendaEventStart;
  durationInMinutes: number;
  startTime?: number;
  endTime?: number;
  roomId?: RoomId;
  room?: Room;
  gameMaster?: GameMaster;
  tables?: number;
  activityId?: ActivityId;
  activity?: Activity;
  description?: string;
  creator?: ShortUser;
  lastModification?: LastModification;
  discordChannel?: DiscordChannelUrl;
  img?: AgendaEventImageUrl;
  withSubscriptions?: boolean;
  maxSubscriptions?: number;
  subscriptionMode?: EventSubscriptionModes;
}

export type AgendaEventId = string;

export type AgendaEventTitle = string;

export type OpenHours = '9h' | '9h30' | '10h' | '10h30' | '11h' | '11h30' | '12h' | '12h30' | '13h' | '13h30' | '14h' | '14h30' | '15h' | '15h30'| '16h'| '16h30'| '17h'| '17h30'| '18h'| '18h30'| '19h'| '19h30'| '20h'| '20h30'| '21h'| '21h30'| '22h'| '22h30'| '23h'| '23h30'| 'Min.';

export type AgendaEventStart = OpenHours;

export type GameMaster = string;

export type DiscordChannelUrl = string;

export type AgendaEventImageUrl = string;