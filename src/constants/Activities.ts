import type { Activity } from '../model/Activity';
import { Colors } from './Colors';

export const JDS_ACTIVITY = {
  id: 'jds',
  name: 'Jeu de société',
  filterable: true,
  countable: true,
  referent: true,
  style: { color: 'black', backgroundColor: Colors.orange },
} as Activity;

export const JDR = {
  id: 'jdr',
  name: 'Jeu de rôle',
  filterable: true,
  countable: true,
  referent: true,
  style: { color: 'white', backgroundColor: Colors.blue },
};

export const CREATION_LUDIQUE = {
  id: 'creation',
  name: 'Création ludique',
  filterable: true,
  countable: true,
  referent: true,
  style: { color: 'black', backgroundColor: Colors.yellow },
};

export const WARHAMMER_40K = {
  id: 'w40k',
  name: 'Warhammer 40K',
  filterable: true,
  countable: true,
  figurines: true,
  referent: true,
  style: { color: 'white', backgroundColor: Colors.purple },
};

export const AOS = {
  id: 'aos',
  name: 'Age Of Sigmar',
  filterable: true,
  countable: true,
  figurines: true,
  referent: true,
  style: { color: 'white', backgroundColor: Colors.green },
};

export const BLOODBOWL = {
  id: 'bb',
  name: 'Bloodbowl',
  filterable: true,
  countable: true,
  figurines: true,
  referent: true,
  style: { color: 'white', backgroundColor: Colors.red2 },
};

export const SHATTERPOINT = {
  id: 'shat',
  name: 'Shatterpoint',
  filterable: true,
  countable: true,
  figurines: true,
  referent: true,
  style: { color: 'white', backgroundColor: Colors.red2 },
};

export const ESCAPE_GAME = {
  id: 'escape',
  name: 'Escape Game',
  filterable: true,
  countable: true,
  referent: true,
  style: { color: 'black', backgroundColor: Colors.orange2 },
};

export const MURDER_PARTY = {
  id: 'murder',
  name: 'Murder Party',
  filterable: true,
  countable: true,
  referent: true,
  style: { color: 'black', backgroundColor: Colors.lightgreen },
};

export const PEINTURE_DE_FIGURINES = {
  id: 'paint',
  name: 'Peinture de figurines',
  filterable: true,
  countable: true,
  style: { color: 'white', backgroundColor: Colors.green },
};

export const REUNION = {
  id: 'reunion',
  name: 'Réunion',
  style: { color: 'white', backgroundColor: Colors.black2 },
};

export const AUBERGE_ESPAGNOLE = {
  id: 'ae',
  name: 'Auberge Espagnole',
  style: { color: 'black', backgroundColor: Colors.yellow },
};

export const EVENEMENT = {
  id: 'event',
  name: 'Evènement',
  style: { color: 'white', backgroundColor: Colors.green },
};

export const AUTRE_TYPE = {
  id: 'autre',
  name: 'Autre',
  countable: true,
  style: { color: 'white', backgroundColor: Colors.gray },
};

export const ACTIVITIES: Activity[] = [
  JDS_ACTIVITY,
  JDR,
  WARHAMMER_40K,
  AOS,
  BLOODBOWL,
  SHATTERPOINT,
  ESCAPE_GAME,
  MURDER_PARTY,
  PEINTURE_DE_FIGURINES,
  REUNION,
  AUBERGE_ESPAGNOLE,
  EVENEMENT,
  AUTRE_TYPE,
];
