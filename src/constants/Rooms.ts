import type { Room } from '../model/Room';

export type Occupation = {
  hour: string;
  tables: number;
  availableTables: number;
  rate?: number;
  roomCapacity: number;
};

export const ROOMS: Room[] = [
  {
    id: 'main',
    name: 'Grande Salle',
    capacity: 100,
  },
  {
    id: 'jdr',
    name: 'Salle JDR',
    capacity: 8,
  },
  {
    id: 'annexe',
    name: 'Salle Annexe',
    capacity: 12,
  },
  {
    id: 'algeco',
    name: 'Algéco',
    capacity: 14,
  },
  {
    id: 'sdl',
    name: 'Salle du Lac',
    capacity: 100,
  },
  {
    id: 'autre',
    name: 'Autre',
    virtual: true,
  },
];

export const TOUTE_LA_SALLE = 999;

export const TABLES = [TOUTE_LA_SALLE, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const ROOM_AUTRE = 'autre';
