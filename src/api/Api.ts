import type {
  AgendaEvent,
  AgendaEventId,
  EventSubscription,
  EventSubscriptionId,
  EventSubscriptionStatus,
} from '../model/AgendaEvent';
import type { DayCounts } from '../model/Counting';
import type { OpenCloseRoom, RoomId } from '../model/Room';
import type {
  RoomKey,
  RoomKeyHistory,
  RoomKeyHistoryEntry, RoomKeyId,
} from '../model/RoomKey';
import type { User, UserId } from '../model/User';
import { firestoreApi } from './FirestoreApi';
import { mockServerApi } from './MockServerApi';
import type { GameDayId } from '../model/GameDay.ts';

// Interface avec le backend (Firestore ou autre)
export interface ApiService {
  /* Gestion utilisateur ******************************************************/
  findAllUsers: (withEmptyName: boolean) => Promise<User[]>;
  findUserById: (userId: UserId) => Promise<User | null>;
  findUserByName: (name: string, excludeUserIds: UserId[]) => Promise<User[]>;
  saveOrUpdateUser: (user: User) => Promise<User>;

  /* Gestion des events *******************************************************/
  findEventById: (eventId: AgendaEventId) => Promise<AgendaEvent | null>;
  findEventsByDayId: (dayId: GameDayId) => Promise<AgendaEvent[]>;
  findAllEventsOfMonth: (year: number, month: number) => Promise<AgendaEvent[]>;
  findEventsByDayIdAndRoomId: (
    dayId: GameDayId,
    roomId: RoomId
  ) => Promise<AgendaEvent[]>;
  findAllEvents: () => Promise<AgendaEvent[]>;
  saveEvent: (event: AgendaEvent | Omit<AgendaEvent, 'id'>) => Promise<AgendaEvent>;
  updateEvent: (event: AgendaEvent) => Promise<AgendaEvent>;
  deleteEvent: (eventId: AgendaEventId) => Promise<void>;

  /* Gestion des badges *******************************************************/
  findAllKeys: () => Promise<RoomKey[]>;
  findKeyById: (keyId: RoomKeyId) => Promise<RoomKey | null>;
  updateKey: (key: RoomKey) => Promise<RoomKey>;
  findKeyHistory: (keyId: RoomKeyId) => Promise<RoomKeyHistory>;
  addToKeyHistory: (entry: RoomKeyHistoryEntry) => Promise<RoomKeyHistory>;

  /* Comptage *****************************************************************/
  saveCountings: (counts: DayCounts) => Promise<void>;
  getCountings: (dayId: GameDayId) => Promise<DayCounts | null>;

  /* Ouverture/Fermeture de la salle ******************************************/
  findOpenCloseConfiguration: (dayId: GameDayId) => Promise<OpenCloseRoom | null>;
  saveOpenCloseConfiguration: (config: OpenCloseRoom) => Promise<void>;

  /* Gestion des inscriptions *************************************************/
  findAllSubscriptionsOfEvent: (
    eventId: AgendaEventId
  ) => Promise<EventSubscription[]>;
  subscribeUserToEvent: (sub: EventSubscription) => Promise<void>;
  unsubscribeUserToEvent: (subId: EventSubscriptionId) => Promise<void>;
  unsubscribeAll: (eventId: AgendaEventId) => Promise<void>;
  updateSubscriptionStatus: (
    sub: EventSubscription,
    status: EventSubscriptionStatus
  ) => Promise<void>;
}

const apiMode = import.meta.env.VITE_API || 'firebase';

export const API =
  apiMode.trim().toLowerCase() === 'mock_server' ? mockServerApi : firestoreApi;
