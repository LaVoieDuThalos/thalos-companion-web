import type { ShortUser } from './User.ts';
import type { GameDayId } from './GameDay.ts';
import type { OpenHours } from './AgendaEvent.ts';

export interface Room {
  id: RoomId;
  name: string;
  capacity?: number;
  week?: 'A' | 'B';
  virtual?: boolean;
}

export interface OpenCloseRoom {
  dayId: GameDayId;
  opener?: Badger;
  openAt: OpenHours;
  closer?: Badger;
}

export type RoomId = string;

export type Badger = ShortUser;