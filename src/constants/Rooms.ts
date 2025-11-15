import type { Room } from '../model/Room';

export type Occupation = {
  hour: string;
  tables: number;
  availableTables: number;
  rate?: number;
  roomCapacity: number;
};

export const SALLE_DU_LAC: Room = {
  id: 'sdl',
  name: 'Salle du Lac',
  capacity: 90,
};

export const AUTRE_SALLE: Room = {
  id: 'autre',
  name: 'Autre',
  virtual: true,
};

export const ROOMS: Room[] = [
  {
    id: 'main',
    name: 'Grande Salle',
    capacity: 10,
    week: 'A',
  },
  {
    id: 'jdr',
    name: 'Salle JDR',
    capacity: 2,
  },
  {
    id: 'annexe',
    name: 'Salle Annexe',
    capacity: 8,
    week: 'A',
  },
  {
    id: 'algeco',
    name: 'Algéco',
    capacity: 10,
    week: 'B',
  },
  SALLE_DU_LAC,
  AUTRE_SALLE,
];

export const TOUTE_LA_SALLE = 999;

export const TABLES = [TOUTE_LA_SALLE, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const ROOM_AUTRE = 'autre';
