export type RoomKeyOwner = {
  id: string;
  name: string;
};

export interface RoomKey {
  id: string;
  name: string;
  owner?: RoomKeyOwner;
}

export type RoomKeyHistory = RoomKeyHistoryEntry[];

export interface RoomKeyHistoryEntry {
  date: string;
  keyId: string;
  from: RoomKeyOwner;
  to: RoomKeyOwner;
}
