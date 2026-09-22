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
  name: 'Cube - Salle JDR',
  capacity: 2,
  closed: true,
};

export const AUTRE_SALLE: Room = {
  id: 'autre',
  name: 'Autre',
  virtual: true,
};

export const ALGECO: Room = {
  id: 'algeco',
  name: 'Cube - Algéco',
  capacity: 8,
  week: 'B',
  closed: true,
};

export const SALLE_ANNEXE: Room = {
  id: 'annexe',
  name: 'Cube - Salle Annexe',
  capacity: 4,
  week: 'A',
  closed: true,
};

export const GRANDE_SALLE: Room = {
  id: 'main',
  name: 'Cube - Grande Salle',
  capacity: 8,
  week: 'A',
  closed: true,
};

export const CASTAGORA: Room = {
  id: 'castagora',
  name: 'Castagora',
  capacity: 20,
  week: 'A',
};

export const CASTAGORA_GRANDE_SALLE: Room = {
  id: 'castagora-main',
  name: 'Castagora - Grande salle',
  capacity: 8,
  week: 'A',
};

export const FORUM: Room = {
  id: 'forum',
  name: 'Castagora - Forum',
  capacity: 8,
  week: 'A',
};

export const HALL: Room = {
  id: 'hall',
  name: 'Castagora - Hall',
  capacity: 8,
  week: 'A',
};

export const SALLE_JDR_CASTAGORA: Room = {
  id: 'casta-jdr',
  name: 'Castagora - Salle JDR',
  capacity: 1,
  week: 'A',
};

export const BUREAUX_CASTAGORA: Room = {
  id: 'bureaux',
  name: 'Castagora - Coin bureaux',
  capacity: 4,
  week: 'A',
};

export const CUISINE: Room = {
  id: 'cuisine',
  name: 'Castagora - Cuisine',
  capacity: 2,
  week: 'A',
};

export const PATIO: Room = {
  id: 'patio',
  name: 'Castagora - Patio',
  capacity: 1,
  week: 'A',
};

export const ROOM_NON_DEFINIE = {
  id: '-',
  name: 'Salle non définie',
  capacity: 1,
};

export const ROOMS: Room[] = [
  FORUM,
  CASTAGORA,
  CASTAGORA_GRANDE_SALLE,
  SALLE_JDR_CASTAGORA,
  CUISINE,
  HALL,
  BUREAUX_CASTAGORA,
  PATIO,
  GRANDE_SALLE,
  SALLE_JDR,
  SALLE_ANNEXE,
  ALGECO,
  SALLE_DU_LAC,
  AUTRE_SALLE,
  ROOM_NON_DEFINIE,
];

export const TOUTE_LA_SALLE = 999;
