/* eslint-disable @typescript-eslint/no-explicit-any */
import { ACTIVITIES } from '../constants/Activities';
import { ROOMS } from '../constants/Rooms';
import type { Activity } from '../model/Activity';
import type { AgendaEvent } from '../model/AgendaEvent';
import type { DayCounts } from '../model/Counting';
import type { OpenCloseRoom, Room } from '../model/Room';
import type {
  RoomKey,
  RoomKeyHistory,
  RoomKeyHistoryEntry,
} from '../model/RoomKey';
import type { User } from '../model/User';
import { fromActivityId, fromGameDayId, fromRoomId } from '../utils/Utils';
import type { ApiService } from './Api';

const baseUrl = 'http://localhost:3000';

export const agendaEventMapper = (
  json: any,
  rooms = ROOMS,
  activities = ACTIVITIES
): AgendaEvent => {
  return {
    ...json,
    day: fromGameDayId(json['day']['id']),
    room: fromRoomId(json['room']['id'], rooms),
    activity: fromActivityId(json['activity']['id'], activities),
  };
};

export const userMapper = (json: any): User => {
  return {
    id: json['id'],
    name: json['name'],
    firstName: json['firstName'],
  } as User;
};

class MockServerApi implements ApiService {
  private activities: Activity[];
  private rooms: Room[];

  constructor(activities: Activity[], rooms: Room[]) {
    this.activities = activities;
    this.rooms = rooms;
  }

  findUserById(userId: string): Promise<User | null> {
    return fetch(`${baseUrl}/users/${userId}`, { method: 'GET' })
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else if (resp.status === 404) {
          return Promise.resolve(null);
        }
        throw new Error(`${resp.status} - ${resp.statusText}`);
      })
      .then((json) => {
        if (json !== null) {
          return userMapper(json);
        } else {
          return null;
        }
      });
  }

  findUserByName(name: string): Promise<User[]> {
    console.error('Not implemented', name);
    return Promise.resolve([]);
  }

  saveOrUpdateUser(user: User): Promise<User> {
    if (!user.id) {
      return fetch(`${baseUrl}/users`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => resp.json())
        .then(userMapper);
    } else {
      return fetch(`${baseUrl}/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => resp.json())
        .then(userMapper);
    }
  }

  findEventById(eventId: string): Promise<AgendaEvent | null> {
    console.log('findEventById() ', eventId);
    return fetch(`${baseUrl}/events?id=${eventId}`, { method: 'GET' })
      .then((resp) => resp.json())
      .then((json) => agendaEventMapper(json[0], this.rooms, this.activities));
  }

  findEventsByDayId(dayId: string): Promise<AgendaEvent[]> {
    console.log('findEventsByDayId()', dayId);
    return fetch(`${baseUrl}/events?dayId=${dayId}`)
      .then((resp) => resp.json())
      .then((json) =>
        json.map((it: any) =>
          agendaEventMapper(it, this.rooms, this.activities)
        )
      );
  }

  findEventsByDayIdAndRoomId(
    dayId: string,
    roomId: string
  ): Promise<AgendaEvent[]> {
    console.log('findEventsByDayIdAndRoomId()', dayId);
    return fetch(`${baseUrl}/events?dayId=${dayId}&roomId=${roomId}`)
      .then((resp) => resp.json())
      .then((json) =>
        json.map((it: any) =>
          agendaEventMapper(it, this.rooms, this.activities)
        )
      );
  }

  findAllEvents(): Promise<AgendaEvent[]> {
    console.log('findAllEvents()');
    return fetch(`${baseUrl}/events`, { method: 'GET' })
      .then((resp) => resp.json())
      .then((json) =>
        json.map((it: any) =>
          agendaEventMapper(it, this.rooms, this.activities)
        )
      );
  }

  saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
    console.log('saveEvent()', event);
    return fetch(`${baseUrl}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((json) => agendaEventMapper(json, this.rooms, this.activities));
  }

  updateEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
    console.log('updateEvent()', event);
    return fetch(`${baseUrl}/events/${event.id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((json) => agendaEventMapper(json, this.rooms, this.activities));
  }

  deleteEvent(eventId: string): Promise<void> {
    console.log('deleteEvent()', eventId);
    return fetch(`${baseUrl}/events/${eventId}`, { method: 'DELETE' }).then();
  }

  findAllUsers(withEmptyName: boolean): Promise<User[]> {
    console.log('findAllUsers()', withEmptyName);
    return fetch(`${baseUrl}/users`, { method: 'GET' })
      .then((resp) => resp.json())
      .then((json) => json.map((it: any) => userMapper(it)));
  }

  findKeyById(keyId: string): Promise<RoomKey | null> {
    return Promise.reject('Not implemented for keyId' + keyId);
  }

  findAllKeys(): Promise<RoomKey[]> {
    console.log('findAllKeys()');
    return Promise.resolve([]);
  }

  updateKey(key: RoomKey): Promise<RoomKey> {
    return Promise.resolve(key);
  }

  findKeyHistory(keyId: string): Promise<RoomKeyHistory> {
    console.log('not implemented', keyId);
    return Promise.resolve([]);
  }

  addToKeyHistory(entry: RoomKeyHistoryEntry): Promise<RoomKeyHistory> {
    console.log('not implemented', entry);
    return Promise.resolve([]);
  }

  saveCountings(counts: DayCounts): Promise<void> {
    console.log('saveCounting', counts);
    return Promise.resolve();
  }

  getCountings(dayId: string): Promise<DayCounts | null> {
    return Promise.resolve({ dayId } as DayCounts);
  }

  findOpenCloseConfiguration(dayId: string): Promise<OpenCloseRoom | null> {
    console.log('findOpenCloseConfiguration', dayId);
    return Promise.resolve(null);
  }

  saveOpenCloseConfiguration(config: OpenCloseRoom): Promise<void> {
    console.log('saveOpenCloseConfiguration', config);
    return Promise.resolve();
  }
}

export const mockServerApi = new MockServerApi(ACTIVITIES, ROOMS);
