import type { AgendaEvent, EventSubscription } from '../model/AgendaEvent';
import type { DayCounts } from '../model/Counting';
import type { OpenCloseRoom } from '../model/Room';
import type {
  RoomKey,
  RoomKeyHistory,
  RoomKeyHistoryEntry,
} from '../model/RoomKey';
import type { User } from '../model/User';
import { firestoreApi } from './FirestoreApi';
import { mockServerApi } from './MockServerApi';

// Interface avec le backend (Firestore ou autre)
export interface ApiService {
  /* Gestion utilisateur ******************************************************/
  findAllUsers: (withEmptyName: boolean) => Promise<User[]>;
  findUserById: (userId: string) => Promise<User | null>;
  findUserByName: (name: string, excludeUserIds: string[]) => Promise<User[]>;
  saveOrUpdateUser: (user: User) => Promise<User>;

  /* Gestion des events *******************************************************/
  findEventById: (eventId: string) => Promise<AgendaEvent | null>;
  findEventsByDayId: (dayId: string) => Promise<AgendaEvent[]>;
  findAllEventsOfMonth: (year: number, month: number) => Promise<AgendaEvent[]>;
  findEventsByDayIdAndRoomId: (
    dayId: string,
    roomId: string
  ) => Promise<AgendaEvent[]>;
  findAllEvents: () => Promise<AgendaEvent[]>;
  saveEvent: (event: Partial<AgendaEvent>) => Promise<AgendaEvent>;
  updateEvent: (event: Partial<AgendaEvent>) => Promise<AgendaEvent>;
  deleteEvent: (eventId: string) => Promise<void>;

  /* Gestion des badges *******************************************************/
  findAllKeys: () => Promise<RoomKey[]>;
  findKeyById: (keyId: string) => Promise<RoomKey | null>;
  updateKey: (key: RoomKey) => Promise<RoomKey>;
  findKeyHistory: (keyId: string) => Promise<RoomKeyHistory>;
  addToKeyHistory: (entry: RoomKeyHistoryEntry) => Promise<RoomKeyHistory>;

  /* Comptage *****************************************************************/
  saveCountings: (counts: DayCounts) => Promise<void>;
  getCountings: (dayId: string) => Promise<DayCounts | null>;

  /* Ouverture/Fermeture de la salle ******************************************/
  findOpenCloseConfiguration: (dayId: string) => Promise<OpenCloseRoom | null>;
  saveOpenCloseConfiguration: (config: OpenCloseRoom) => Promise<void>;

  /* Gestion des inscriptions *************************************************/
  findAllSubscriptionsOfEvent: (
    eventId: string
  ) => Promise<EventSubscription[]>;
  subscribeUserToEvent: (sub: EventSubscription) => Promise<void>;
  unsubscribeUserToEvent: (subId: string) => Promise<void>;
  unsubscribeAll: (eventId: string) => Promise<void>;
  updateSubscriptionStatus: (
    sub: EventSubscription,
    status: string
  ) => Promise<void>;
}

const apiMode = import.meta.env.VITE_API || 'firebase';

export const API =
  apiMode.trim().toLowerCase() === 'mock_server' ? mockServerApi : firestoreApi;
