export interface Room {
  closed: boolean;
  id: string;
  name: string;
  capacity?: number;
  week?: 'A' | 'B';
  virtual?: boolean;
  closed?: boolean;
}

export interface OpenCloseRoom {
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
  validated?: boolean;
}
