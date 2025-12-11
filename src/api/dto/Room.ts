export interface RoomDto {
  id: string;
  name: string;
  capacity?: number;
  week?: 'A' | 'B';
  virtual?: boolean;
}

export interface OpenCloseRoomDto {
  dayId: string;
  opener?: {
    id: string;
    name: string;
  };
  openAt: string;
  closer?: {
    id: string;
    name: string;
  };
}