import type { ShortUser } from './User.ts';

export type RoomKeyOwner = ShortUser;

export interface RoomKey {
  id: RoomKeyId;
  name: string;
  owner?: RoomKeyOwner;
}

export type RoomKeyId = string;

export type RoomKeyHistory = RoomKeyHistoryEntry[];

export interface RoomKeyHistoryEntry {
  date: KeyHistoryEntryDate;
  keyId: RoomKeyId;
  from: RoomKeyOwner;
  to: RoomKeyOwner;
}

export type KeyHistoryEntryDate = string;
