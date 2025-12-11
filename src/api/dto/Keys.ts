export interface RoomKeyDto {
  id: string;
  name: string;
  owner?: {
    id: string;
    name: string;
  }
}

export type RoomKeyHistoryDto = RoomKeyHistoryEntryDto[];

export interface RoomKeyHistoryEntryDto {
  date: string;
  keyId: string;
  from?: {
    id: string;
    name: string;
  };
  to?: {
    id: string;
    name: string;
  };
}