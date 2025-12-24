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

export const SALLE_JDR = {
  id: 'jdr',
  name: 'Salle JDR',
  capacity: 2,
};

export const AUTRE_SALLE: Room = {
  id: 'autre',
  name: 'Autre',
  virtual: true,
};

export const ALGECO: Room = {
  id: 'algeco',
  name: 'Algéco',
  capacity: 10,
  week: 'B',
};

export const SALLE_ANNEXE: Room = {
  id: 'annexe',
  name: 'Salle Annexe',
  capacity: 8,
  week: 'A',
};

export const GRANDE_SALLE: Room = {
  id: 'main',
  name: 'Grande Salle',
  capacity: 10,
  week: 'A',
};

export const ROOMS: Room[] = [
  GRANDE_SALLE,
  SALLE_JDR,
  SALLE_ANNEXE,
  ALGECO,
  SALLE_DU_LAC,
  AUTRE_SALLE,
];

export const TOUTE_LA_SALLE = 999;
