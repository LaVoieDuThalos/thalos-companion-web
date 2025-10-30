import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@firebase/firestore';
import type { AgendaEvent } from '../model/AgendaEvent';
import type { DayCounts } from '../model/Counting';
import type { OpenCloseRoom } from '../model/Room';
import type { RoomKey } from '../model/RoomKey';
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
  COUNTINGS: 'countings',
  DAYS: 'days',
};

class FirestoreApi implements ApiService {
  findUserById(userId: string): Promise<User | null> {
    console.log('FS findUserById()', userId);
    return getDoc(doc(FirebaseDb, Collections.USERS, userId)).then((res) => {
      return res.data()
        ? ({
            ...res.data(),
          } as User)
        : null;
    });
  }

  saveOrUpdateUser(user: User): Promise<User> {
    console.log('saveOrUpdateUser()', user);
    return setDoc(doc(FirebaseDb, Collections.USERS, user.id), user)
      .then(() => this.findUserById(user.id))
      .then((user) => {
        if (user === null) {
          throw new Error('Fail to create user');
        }
        return Promise.resolve(user);
      });
  }

  findEventById(eventId: string): Promise<AgendaEvent | null> {
    console.log('findEventById()', eventId);
    return getDoc(doc(FirebaseDb, Collections.EVENTS, eventId)).then((res) => {
      return res.data() ? mapDtoToAgendaEvent(res.id, res.data()) : null;
    });
  }

  findEventsByDayId(dayId: string): Promise<AgendaEvent[]> {
    console.log('findEventsByDayId()', dayId);
    const q = query(
      collection(FirebaseDb, Collections.EVENTS),
      where('dayId', '==', dayId)
    );
    return getDocs(q).then((results) => {
      return results.docs.map((doc) => mapDtoToAgendaEvent(doc.id, doc.data()));
    });
  }

  findEventsByDayIdAndRoomId(
    dayId: string,
    roomId: string
  ): Promise<AgendaEvent[]> {
    console.log('findEventsByDayIdAndRoomId()', dayId, roomId);
    const q = query(
      collection(FirebaseDb, Collections.EVENTS),
      where('dayId', '==', dayId),
      where('roomId', '==', roomId)
    );
    return getDocs(q).then((results) => {
      return results.docs.map((doc) => mapDtoToAgendaEvent(doc.id, doc.data()));
    });
  }

  findAllEvents(): Promise<AgendaEvent[]> {
    console.log('findAllEvents()');
    return getDocs(collection(FirebaseDb, Collections.EVENTS)).then(
      (results) => {
        const events = results.docs.map((doc) =>
          mapDtoToAgendaEvent(doc.id, doc.data())
        );
        return events;
      }
    );
  }

  saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
    console.log('saveEvent()', event);
    return addDoc(
      collection(FirebaseDb, Collections.EVENTS),
      mapAgendaEventToDto(event)
    )
      .then((res) => this.findEventById(res.id))
      .then((event) => {
        if (event === null) {
          throw new Error('No event found with id ');
        } else {
          return Promise.resolve(event);
        }
      });
  }

  updateEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
    console.log('updateEvent()', event);
    if (event && event.id) {
      return setDoc(
        doc(FirebaseDb, Collections.EVENTS, event.id),
        mapAgendaEventToDto(event)
      )
        .then(() => this.findEventById(event.id!))
        .then((event) => {
          if (event === null) {
            throw new Error('No event found with id ');
          } else {
            return Promise.resolve(event);
          }
        });
    } else {
      throw new Error('Unable to update event with id empty' + event);
    }
  }

  deleteEvent(eventId: string): Promise<void> {
    console.log('deleteEvent()', eventId);
    return deleteDoc(doc(FirebaseDb, Collections.EVENTS, eventId));
  }

  findAllUsers(): Promise<User[]> {
    console.log('findAllUsers()');
    return getDocs(collection(FirebaseDb, Collections.USERS)).then((results) =>
      results.docs
        .map((doc) => mapDtoToUser(doc.id, doc.data()))
        .sort((a, b) => `${a.name}`.localeCompare(`${b.name}`))
    );
  }

  findKeyById(keyId: string): Promise<RoomKey | null> {
    console.log('findKeyById()');
    return getDoc(doc(FirebaseDb, Collections.KEYS, keyId)).then((result) => {
      return result.data() ? mapDtoToRoomKey(result.id, result.data()) : null;
    });
  }

  findAllKeys(): Promise<RoomKey[]> {
    console.log('findAllKeys()');
    return getDocs(collection(FirebaseDb, Collections.KEYS)).then((results) =>
      results.docs.map((doc) => mapDtoToRoomKey(doc.id, doc.data()))
    );
  }

  updateKey(key: RoomKey): Promise<RoomKey> {
    console.log('updateKey()', key);
    return setDoc(doc(FirebaseDb, Collections.KEYS, key.id), { ...key })
      .then(() => this.findKeyById(key.id))
      .then((k) => {
        if (k === null) {
          throw new Error('Fail to find key by id ');
        }
        return k;
      });
  }

  saveCountings(counts: DayCounts): Promise<void> {
    console.log('saveCountings()', counts);
    return setDoc(doc(FirebaseDb, Collections.COUNTINGS, counts.dayId), counts);
  }

  getCountings(dayId: string): Promise<DayCounts | null> {
    console.log('getCountings()');
    return getDoc(doc(FirebaseDb, Collections.COUNTINGS, dayId)).then(
      (result) => {
        return result.data() ? ({ ...result.data() } as DayCounts) : null;
      }
    );
  }

  findOpenCloseConfiguration(dayId: string): Promise<OpenCloseRoom | null> {
    console.log('findOpenCloseConfiguration()');
    return getDoc(doc(FirebaseDb, Collections.DAYS, dayId)).then((result) => {
      return result.data() ? ({ ...result.data() } as OpenCloseRoom) : null;
    });
  }

  saveOpenCloseConfiguration(config: OpenCloseRoom): Promise<void> {
    console.log('saveOpenCloseConfiguration()');
    return setDoc(doc(FirebaseDb, Collections.DAYS, config.dayId), config);
  }
}

export const firestoreApi = new FirestoreApi();
