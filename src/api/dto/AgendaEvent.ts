import type { ShortUser } from '../../model/User.ts';
import type {
  AgendaEventId,
  EventSubscriptionDate,
  EventSubscriptionId,
  EventSubscriptionStatus,
} from '../../model/AgendaEvent.ts';

export interface AgendaEventDto {
  id: string;
  title: string;
  dayId: string;
  start: string;
  durationInMinutes: number;
  startTime?: number;
  endTime?: number;
  roomId?: string;
  gameMaster?: string;
  tables?: number;
  activityId?: string;
  description?: string;
  creator: {
    id: string;
    name: string;
  };
  lastModification?: {
    date: string;
    user: {
      id: string;
      name: string;
    };
  };
  discordChannel?: string;
  img?: string;
  withSubscriptions?: boolean;
  maxSubscriptions?: number;
  subscriptionMode?: string;
}

export type EventSubscriptionDto = {
  id: string;
  eventId: string;
  user: {
    id: string;
    name: string;
  };
  name?: string;
  subscribedAt: string;
  status?: string;
};