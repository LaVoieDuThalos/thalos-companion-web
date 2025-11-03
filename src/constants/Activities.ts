import type { Activity } from '../model/Activity';
import { Colors } from './Colors';

export const ACTIVITIES: Activity[] = [
  {
    id: 'jds',
    name: 'Jeu de société',
    filterable: true,
    countable: true,
    style: { color: 'black', backgroundColor: Colors.orange },
  },
  {
    id: 'jdr',
    name: 'Jeu de rôle',
    filterable: true,
    countable: true,
    style: { color: 'white', backgroundColor: Colors.blue },
  },
  {
    id: 'w40k',
    name: 'Warhammer 40K',
    filterable: true,
    countable: true,
    figurines: true,
    style: { color: 'white', backgroundColor: Colors.purple },
  },
  {
    id: 'aos',
    name: 'Age Of Sigmar',
    filterable: true,
    countable: true,
    figurines: true,
    style: { color: 'white', backgroundColor: Colors.green },
  },
  {
    id: 'bb',
    name: 'Bloodbowl',
    filterable: true,
    countable: true,
    figurines: true,
    style: { color: 'white', backgroundColor: Colors.red2 },
  },
  {
    id: 'shat',
    name: 'Shatterpoint',
    filterable: true,
    countable: true,
    figurines: true,
    style: { color: 'white', backgroundColor: Colors.red2 },
  },
  {
    id: 'escape',
    name: 'Escape Game',
    filterable: true,
    countable: true,
    style: { color: 'black', backgroundColor: Colors.orange2 },
  },
  {
    id: 'murder',
    name: 'Murder Party',
    filterable: true,
    countable: true,
    style: { color: 'black', backgroundColor: Colors.lightgreen },
  },
  {
    id: 'paint',
    name: 'Peinture de figurines',
    filterable: true,
    countable: true,
    style: { color: 'white', backgroundColor: Colors.green },
  },
  {
    id: 'reunion',
    name: 'Réunion',
    style: { color: 'white', backgroundColor: Colors.black2 },
  },
  {
    id: 'ae',
    name: 'Auberge Espagnole',
    style: { color: 'black', backgroundColor: Colors.yellow },
  },
  {
    id: 'autre',
    name: 'Autre',
    style: { color: 'white', backgroundColor: Colors.gray },
  },
];
