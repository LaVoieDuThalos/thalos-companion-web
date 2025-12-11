import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from '@firebase/firestore';
import type { AgendaEvent, EventSubscription } from '../model/AgendaEvent';
import type { DayCounts } from '../model/Counting';
import type { OpenCloseRoom } from '../model/Room';
import type {
  RoomKey,
  RoomKeyHistory,
  RoomKeyHistoryEntry,
} from '../model/RoomKey';
import type { User } from '../model/User';
import type { ApiService } from './Api';
import {
  mapAgendaEventToDto,
  mapDtoToAgendaEvent,
  mapDtoToRoomKey,
  mapDtoToUser,
} from './Mappers';

import { FirebaseDb } from '../../firebaseConfig';

const Collections = {
  USERS: 'users',
  EVENTS: 'events',
  KEYS: 'keys',
  KEY_HISTORY: 'key-history',
  COUNTINGS: 'countings',
  DAYS: 'days',
  SUBSCRIPTIONS: 'event-subscriptions',
};

// Backend
const FieldNames = {
  ID: 'id',
  DAY_ID: 'dayId',
  NAME: 'name',
  ROOM_ID: 'roomId',
  KEY_ID: 'keyId',
  DATE: 'date',
  EVENT_ID: 'eventId',
  SUBSCRIBED_AT: 'subscribedAt',
};

class FirestoreApi implements ApiService {
  /* Gestion utilisateur ******************************************************/

  // Recherche tous les utilisateurs qui ont au moins un nom renseigné
  // si withEmptyName=true, retourne tous les utilisateurs
  async findAllUsers(withEmptyName: boolean): Promise<User[]> {
    console.log('findAllUsers()', withEmptyName);
    const q = query(
      collection(FirebaseDb, Collections.USERS),
      where(FieldNames.NAME, '!=', '')
    );
    const results = await getDocs(
      withEmptyName ? collection(FirebaseDb, Collections.USERS) : q
    );
    return results.docs
      .map((doc) => mapDtoToUser(doc.id, doc.data()))
      .sort((a, b) => `${a.name}`.localeCompare(`${b.name}`));
  }

  // Recherche l'utilisateur par son identifiant
  async findUserById(userId: string): Promise<User | null> {
    console.log('FS findUserById()', userId);
    const res = await getDoc(doc(FirebaseDb, Collections.USERS, userId));
    return res.data()
      ? ({
          ...res.data(),
        } as User)
      : null;
  }

  // Recherche l'utilisateur par son nom en excluant ceux avec les identifiants mentionnés dans 'excludeIds'
  async findUserByName(
    name: string,
    excludeIds: string[] = []
  ): Promise<User[]> {
    console.log('FS findUserByName()', name, excludeIds);
    const q = query(
      collection(FirebaseDb, Collections.USERS),
      where(FieldNames.NAME, '==', name),
      where(FieldNames.ID, 'not-in', excludeIds)
    );
    const results = await getDocs(q);
    if (results.docs.length === 0) {
      return [];
    } else {
      return results.docs.map((res) => mapDtoToUser(res.id, res.data()));
    }
  }

  // Enregistre les infos d'un utilisateur (création si inexistant)
  async saveOrUpdateUser(user: User): Promise<User> {
    console.log('saveOrUpdateUser()', user);
    await setDoc(doc(FirebaseDb, Collections.USERS, user.id), user);
    const user_1 = await this.findUserById(user.id);
    if (user_1 === null) {
      throw new Error('Fail to create user');
    }
    return user_1;
  }

  /* Gestion des events *******************************************************/

  // Recherche un event par son identifiant
  async findEventById(eventId: string): Promise<AgendaEvent | null> {
    console.log('findEventById()', eventId);
    const res = await getDoc(doc(FirebaseDb, Collections.EVENTS, eventId));
    return res.data() ? mapDtoToAgendaEvent(res.id, res.data()) : null;
  }

  // Recherche tous les events pour une journée donnée
  async findEventsByDayId(dayId: string): Promise<AgendaEvent[]> {
    console.log('findEventsByDayId()', dayId);
    const q = query(
      collection(FirebaseDb, Collections.EVENTS),
      where(FieldNames.DAY_ID, '==', dayId)
    );
    const results = await getDocs(q);
    return results.docs.map((doc) => mapDtoToAgendaEvent(doc.id, doc.data()));
  }

  // Recherche tous les events durant un mois
  // month=0
  async findAllEventsOfMonth(
    year: number,
    month: number
  ): Promise<AgendaEvent[]> {
    console.log('findAllEventsOfMonth()', year, month);

    const monthStr = `${month}`.padStart(2, '0');

    const q = query(
      collection(FirebaseDb, Collections.EVENTS),
      and(
        where(FieldNames.DAY_ID, '>=', `${year}-${monthStr}-01`),
        where(FieldNames.DAY_ID, '<=', `${year}-${monthStr}-31`)
      )
    );
    const results = await getDocs(q);
    return results.docs.map((doc) => mapDtoToAgendaEvent(doc.id, doc.data()));
  }

  // Recherche tous les events prévus dans une salle et une journée donnée
  async findEventsByDayIdAndRoomId(
    dayId: string,
    roomId: string
  ): Promise<AgendaEvent[]> {
    console.log('findEventsByDayIdAndRoomId()', dayId, roomId);
    const q = query(
      collection(FirebaseDb, Collections.EVENTS),
      where(FieldNames.DAY_ID, '==', dayId),
      where(FieldNames.ROOM_ID, '==', roomId)
    );
    const results = await getDocs(q);
    return results.docs.map((doc) => mapDtoToAgendaEvent(doc.id, doc.data()));
  }

  // Recherche tous les events enregistrés
  async findAllEvents(): Promise<AgendaEvent[]> {
    console.log('findAllEvents()');
    const results = await getDocs(collection(FirebaseDb, Collections.EVENTS));
    return results.docs.map((doc) => mapDtoToAgendaEvent(doc.id, doc.data()));
  }

  // Enregistre un event et le retourne avec son nouvel identifiant s'il a été crée
  async saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
    console.log('saveEvent()', event);
    const res = await addDoc(
      collection(FirebaseDb, Collections.EVENTS),
      mapAgendaEventToDto(event)
    );
    const event_1 = await this.findEventById(res.id);
    if (event_1 === null) {
      throw new Error('No event found with id ');
    } else {
      return Promise.resolve(event_1);
    }
  }

  // Mise à jour d'un event et le retourne
  async updateEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
    console.log('updateEvent()', event);
    if (event && event.id) {
      await setDoc(
        doc(FirebaseDb, Collections.EVENTS, event.id),
        mapAgendaEventToDto(event)
      );
      const event_1 = await this.findEventById(event.id!);
      if (event_1 === null) {
        throw new Error('No event found with id ');
      } else {
        return Promise.resolve(event_1);
      }
    } else {
      throw new Error('Unable to update event with id empty' + event);
    }
  }

  // Supprime un event avec son identifiant
  deleteEvent(eventId: string): Promise<void> {
    console.log('deleteEvent()', eventId);
    return deleteDoc(doc(FirebaseDb, Collections.EVENTS, eventId));
  }

  /* Gestion des badges *******************************************************/

  // Recherche tous les badges enregistrés
  async findAllKeys(): Promise<RoomKey[]> {
    console.log('findAllKeys()');
    const results = await getDocs(collection(FirebaseDb, Collections.KEYS));
    return results.docs.map((doc) => mapDtoToRoomKey(doc.id, doc.data()));
  }

  // Recherche un badge par son identifiant
  async findKeyById(keyId: string): Promise<RoomKey | null> {
    console.log('findKeyById()');
    const result = await getDoc(doc(FirebaseDb, Collections.KEYS, keyId));
    return result.data() ? mapDtoToRoomKey(result.id, result.data()) : null;
  }

  // Mise à jour des infos d'un badge
  async updateKey(key: RoomKey): Promise<RoomKey> {
    console.log('updateKey()', key);
    await setDoc(doc(FirebaseDb, Collections.KEYS, key.id), { ...key });
    const k = await this.findKeyById(key.id);
    if (k === null) {
      throw new Error('Fail to find key by id ');
    }
    return k;
  }

  // Recherche l'historique des échanges d'un badge
  // maxLog : Nombre de log à récupérer
  async findKeyHistory(keyId: string, maxLog = 10): Promise<RoomKeyHistory> {
    console.log('findKeyHistory()', keyId);
    const q = query(
      collection(FirebaseDb, Collections.KEY_HISTORY),
      where(FieldNames.KEY_ID, '==', keyId),
      orderBy(FieldNames.DATE, 'desc'),
      limit(maxLog)
    );
    const results = await getDocs(q);
    return results.docs.map((doc) => doc.data() as RoomKeyHistoryEntry);
  }

  // Ajoute un log dans l'historique des échange de badge
  async addToKeyHistory(entry: RoomKeyHistoryEntry): Promise<RoomKeyHistory> {
    await addDoc(collection(FirebaseDb, Collections.KEY_HISTORY), entry);
    return await this.findKeyHistory(entry.keyId);
  }

  /* Comptage *****************************************************************/

  // Enregistre un comptage
  saveCountings(counts: DayCounts): Promise<void> {
    console.log('saveCountings()', counts);
    return setDoc(doc(FirebaseDb, Collections.COUNTINGS, counts.dayId), counts);
  }

  // Recherche le comptage pour une journée donnée
  async getCountings(dayId: string): Promise<DayCounts | null> {
    console.log('getCountings()');
    const result = await getDoc(doc(FirebaseDb, Collections.COUNTINGS, dayId));
    return result.data() ? ({ ...result.data() } as DayCounts) : null;
  }

  /* Ouverture/Fermeture de la salle ******************************************/

  // Recherche les configs open/close pour une journée donnée
  async findOpenCloseConfiguration(
    dayId: string
  ): Promise<OpenCloseRoom | null> {
    console.log('findOpenCloseConfiguration()');
    const result = await getDoc(doc(FirebaseDb, Collections.DAYS, dayId));
    return result.data() ? ({ ...result.data() } as OpenCloseRoom) : null;
  }

  // Enregistre une config open/close pour une journée
  saveOpenCloseConfiguration(config: OpenCloseRoom): Promise<void> {
    console.log('saveOpenCloseConfiguration()');
    return setDoc(doc(FirebaseDb, Collections.DAYS, config.dayId), config);
  }

  /* Gestion des inscriptions *************************************************/

  // Recherche toutes les inscriptions d'un event
  async findAllSubscriptionsOfEvent(
    eventId: string
  ): Promise<EventSubscription[]> {
    console.log('findAllSubscriptionsOfEvent', eventId);
    const q = query(
      collection(FirebaseDb, Collections.SUBSCRIPTIONS),
      where(FieldNames.EVENT_ID, '==', eventId),
      orderBy(FieldNames.SUBSCRIBED_AT, 'asc')
    );
    const results = await getDocs(q);
    return results.docs.map((doc) => doc.data() as EventSubscription);
  }

  // Enregistre une nouvelle inscription d'un utilisateur pour un event
  subscribeUserToEvent(sub: EventSubscription): Promise<void> {
    console.log('subscribeUserToEvent', sub);
    return setDoc(doc(FirebaseDb, Collections.SUBSCRIPTIONS, sub.id), sub);
  }

  // Enregistre une désinscripton d'un utilisateur sur un event
  unsubscribeUserToEvent(subId: string): Promise<void> {
    console.log('subscribeUserToEvent', subId);
    return deleteDoc(doc(FirebaseDb, Collections.SUBSCRIPTIONS, subId));
  }

  // Supprime toutes les inscriptions d'un event
  async unsubscribeAll(eventId: string): Promise<void> {
    console.log('unsubscribeAll', eventId);

    const q = query(
      collection(FirebaseDb, Collections.SUBSCRIPTIONS),
      where(FieldNames.EVENT_ID, '==', eventId)
    );
    const snap = await getDocs(q);
    return snap.forEach((sub) =>
      deleteDoc(doc(FirebaseDb, Collections.SUBSCRIPTIONS, sub.data()['id']))
    );
  }

  // Mise à jour du statut d'une inscription d'un utilisateur sur un event
  updateSubscriptionStatus(
    sub: EventSubscription,
    status: string
  ): Promise<void> {
    console.log('updateSubscriptionStatus', sub, status);
    return setDoc(doc(FirebaseDb, Collections.SUBSCRIPTIONS, sub.id), {
      ...sub,
      status,
    });
  }
}

export const firestoreApi = new FirestoreApi();
