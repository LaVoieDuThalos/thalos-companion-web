import { calendarService } from '../services/CalendarService';
import { roomService } from '../services/RoomService';
import {
  AUBERGE_ESPAGNOLE,
  EVENEMENT_CASTAGORA,
  JDR,
  JDS_ACTIVITY,
  PEINTURE_DE_FIGURINES,
  WARHAMMER_40K,
} from './Activities';
import { JUSQUA_LA_FERMETURE } from './Durations';
import { MODE_AUTO_BY_REGISTRATION_DATE } from './EventSubscriptionModes';
import { CASTAGORA, CUISINE, TOUTE_LA_SALLE } from './Rooms';

type InitFormData = { [key: string]: unknown };

export type EventCreationMode = {
  id: string;
  label: string;
  color?: string;
  backgroundColor?: string;
  formDataFn: () => InitFormData;
};

export const CREATION_MODES: EventCreationMode[] = [
  {
    id: 'w40kNextFriday',
    label: 'Rencontre Warhammer 40K Vendredi prochain',
    color: WARHAMMER_40K.style.color,
    backgroundColor: WARHAMMER_40K.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextFridayGameDay();
      const activityId = 'w40k';
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(activityId);
      return {
        title: 'Rencontres 40k',
        activityId: activityId,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: TOUTE_LA_SALLE,
        withSubscriptions: true,
        maxSubscriptions: 6,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },
  {
    id: 'w40kNextSaturday',
    label: 'Rencontre 40K Samedi prochain',
    color: WARHAMMER_40K.style.color,
    backgroundColor: WARHAMMER_40K.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextSaturdayGameDay();
      const activityId = 'w40k';
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(activityId);
      return {
        title: 'Rencontres 40k',
        activityId: activityId,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: TOUTE_LA_SALLE,
        withSubscriptions: true,
        maxSubscriptions: 6,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },
  /* {
    id: 'aosNextFriday',
    label: 'Rencontre AoS Vendredi prochain',
    color: AOS.style.color,
    backgroundColor: AOS.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextFridayGameDay();
      const activityId = AOS.id;
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(activityId);
      return {
        title: 'Rencontres AoS',
        activityId: activityId,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 2,
        withSubscriptions: true,
        maxSubscriptions: 1,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },
  {
    id: 'aosNextSaturday',
    label: 'Rencontre AoS Samedi prochain',
    color: AOS.style.color,
    backgroundColor: AOS.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextSaturdayGameDay();
      const activityId = AOS.id;
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(activityId);
      return {
        title: 'Rencontres AoS',
        activityId: activityId,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 2,
        withSubscriptions: true,
        maxSubscriptions: 1,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },

  {
    id: 'bbNextFriday',
    label: 'Rencontre BloodBowl Vendredi prochain',
    color: BLOODBOWL.style.color,
    backgroundColor: BLOODBOWL.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextFridayGameDay();
      const activityId = BLOODBOWL.id;
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(activityId);
      return {
        title: 'Rencontre Blood bowl',
        activityId: BLOODBOWL.id,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 1,
        withSubscriptions: true,
        maxSubscriptions: 1,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },
  {
    id: 'bbNextSaturday',
    label: 'Rencontre Blood bowl Samedi prochain',
    color: BLOODBOWL.style.color,
    backgroundColor: BLOODBOWL.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextSaturdayGameDay();
      const activityId = BLOODBOWL.id;
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(activityId);
      return {
        title: 'Rencontres AoS',
        activityId: activityId,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 1,
        withSubscriptions: true,
        maxSubscriptions: 1,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },*/
  {
    id: 'bigJDS',
    label: 'Jeu de société (Avec inscriptions)',
    color: JDS_ACTIVITY.style.color,
    backgroundColor: JDS_ACTIVITY.style.backgroundColor,
    formDataFn: () => {
      return {
        activityId: JDS_ACTIVITY.id,
        withSubscriptions: true,
        maxSubscriptions: 4,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },
  /*{
    id: 'jdr',
    label: 'Jeu de rôle standard',
    color: JDR.style.color,
    backgroundColor: JDR.style.backgroundColor,
    formDataFn: () => {
      return {
        activityId: 'jdr',
        roomId: SALLE_JDR_CASTAGORA.id,
        start: '20h',
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: TOUTE_LA_SALLE,
      };
    },
  },*/
  {
    id: 'bigJdr',
    label: 'Jeu de rôle (Avec inscriptions)',
    color: JDR.style.color,
    backgroundColor: JDR.style.backgroundColor,
    formDataFn: () => {
      return {
        activityId: 'jdr',
        withSubscriptions: true,
        maxSubscriptions: 4,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },
  {
    id: 'peinture',
    label: 'Atelier Peinture',
    color: PEINTURE_DE_FIGURINES.style.color,
    backgroundColor: PEINTURE_DE_FIGURINES.style.backgroundColor,
    formDataFn: () => {
      return {
        title: 'Atelier Peinture',
        activityId: PEINTURE_DE_FIGURINES.id,
        roomId: CUISINE.id,
        tables: TOUTE_LA_SALLE,
        description:
          "Offrir un moment convivial permettant aux participants de peindre leurs figurines en groupe, d'échanger des astuces et de partager leur passion, sans initiation ni accompagnement pédagogique structuré.",
        maxSubscriptions: 4,
        subscriptionMode: MODE_AUTO_BY_REGISTRATION_DATE.id,
      };
    },
  },
  {
    id: 'aubergeEsp',
    label: 'Auberge Espagnole',
    color: AUBERGE_ESPAGNOLE.style.color,
    backgroundColor: AUBERGE_ESPAGNOLE.style.backgroundColor,
    formDataFn: () => {
      return {
        title: 'Auberge Espagnole',
        activityId: 'ae',
        roomId: CUISINE.id,
        start: '19h',
        durationInMinutes: 60,
        tables: TOUTE_LA_SALLE,
        description: 'Venez avec quelque chose à partager !',
      };
    },
  },
  {
    id: 'eventCastagora',
    label: 'Evènement à Castagora (Aucune salle disponible)',
    color: EVENEMENT_CASTAGORA.style.color,
    backgroundColor: EVENEMENT_CASTAGORA.style.backgroundColor,
    formDataFn: () => {
      return {
        title: 'Evènement à Castagora (Aucune salle disponible !)',
        activityId: EVENEMENT_CASTAGORA.id,
        roomId: CASTAGORA.id,
        tables: TOUTE_LA_SALLE,
        description:
          'Un évènement dans la programmation de Castagora occupe toutes les salles.',
      };
    },
  },
  {
    id: 'default',
    label: 'Autre',
    formDataFn: () => {
      return {};
    },
  },
];
