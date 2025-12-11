import type {
  AgendaEvent,
  AgendaEventId,
  EventSubscription,
  EventSubscriptionId,
  EventSubscriptionStatus,
} from '../model/AgendaEvent';
import type { RoomId } from '../model/Room';
import type {RoomKeyId,
} from '../model/RoomKey';
import type { UserId } from '../model/User';
import { firestoreApi } from './FirestoreApi';
import type { GameDayId } from '../model/GameDay.ts';
import type { UserDto } from './dto/User.ts';
import type { AgendaEventDto, EventSubscriptionDto } from './dto/AgendaEvent.ts';
import type { RoomKeyDto, RoomKeyHistoryDto, RoomKeyHistoryEntryDto } from './dto/Keys.ts';
import type { DayCountsDto } from './dto/Countings.ts';
import type { OpenCloseRoomDto } from './dto/Room.ts';

// Interface avec le backend (Firestore ou autre)
export interface ApiService {
  /* Gestion utilisateur ******************************************************/
  findAllUsers: (withEmptyName: boolean) => Promise<UserDto[]>;
  findUserById: (userId: UserId) => Promise<UserDto | null>;
  findUserByName: (name: string, excludeUserIds: UserId[]) => Promise<UserDto[]>;
  saveOrUpdateUser: (user: UserDto) => Promise<UserDto>;

  /* Gestion des events *******************************************************/
  findEventById: (eventId: AgendaEventId) => Promise<AgendaEventDto | null>;
  findEventsByDayId: (dayId: GameDayId) => Promise<AgendaEventDto[]>;
  findAllEventsOfMonth: (year: number, month: number) => Promise<AgendaEventDto[]>;
  findEventsByDayIdAndRoomId: (
    dayId: GameDayId,
    roomId: RoomId
  ) => Promise<AgendaEventDto[]>;
  findAllEvents: () => Promise<AgendaEventDto[]>;
  saveEvent: (event: AgendaEventDto) => Promise<AgendaEventDto>;
  updateEvent: (event: AgendaEventDto) => Promise<AgendaEventDto>;
  deleteEvent: (eventId: AgendaEventId) => Promise<void>;

  /* Gestion des badges *******************************************************/
  findAllKeys: () => Promise<RoomKeyDto[]>;
  findKeyById: (keyId: RoomKeyId) => Promise<RoomKeyDto | null>;
  updateKey: (key: RoomKeyDto) => Promise<RoomKeyDto>;
  findKeyHistory: (keyId: RoomKeyId) => Promise<RoomKeyHistoryDto>;
  addToKeyHistory: (entry: RoomKeyHistoryEntryDto) => Promise<RoomKeyHistoryDto>;

  /* Comptage *****************************************************************/
  saveCountings: (counts: DayCountsDto) => Promise<void>;
  getCountings: (dayId: GameDayId) => Promise<DayCountsDto | null>;

  /* Ouverture/Fermeture de la salle ******************************************/
  findOpenCloseConfiguration: (dayId: GameDayId) => Promise<OpenCloseRoomDto | null>;
  saveOpenCloseConfiguration: (config: OpenCloseRoomDto) => Promise<void>;

  /* Gestion des inscriptions *************************************************/
  findAllSubscriptionsOfEvent: (
    eventId: AgendaEventId
  ) => Promise<EventSubscriptionDto[]>;
  subscribeUserToEvent: (sub: EventSubscriptionDto) => Promise<void>;
  unsubscribeUserToEvent: (subId: EventSubscriptionId) => Promise<void>;
  unsubscribeAll: (eventId: AgendaEventId) => Promise<void>;
  updateSubscriptionStatus: (
    sub: EventSubscriptionDto,
    status: EventSubscriptionStatus
  ) => Promise<void>;
}

//const apiMode = import.meta.env.VITE_API || 'firebase';

export const API: ApiService = firestoreApi;
