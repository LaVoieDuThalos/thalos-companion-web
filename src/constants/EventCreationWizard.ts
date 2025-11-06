import { calendarService } from '../services/CalendarService';
import { roomService } from '../services/RoomService';
import { AOS, AUBERGE_ESPAGNOLE, JDR, WARHAMMER_40K } from './Activities';
import { JUSQUA_LA_FERMETURE } from './Durations';

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
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(
        activityId,
        day
      );
      return {
        activityId: activityId,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 2,
      };
    },
  },
  {
    id: 'w40kNextSaturday',
    label: 'Rencontre Warhammer 40K Samedi prochain',
    color: WARHAMMER_40K.style.color,
    backgroundColor: WARHAMMER_40K.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextSaturdayGameDay();
      const activityId = 'w40k';
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(
        activityId,
        day
      );
      return {
        activityId: activityId,
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 2,
      };
    },
  },
  {
    id: 'figNextFriday',
    label: 'Rencontre Figurines Vendredi prochain',
    color: AOS.style.color,
    backgroundColor: AOS.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextFridayGameDay();
      const activityId = 'w40k';
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(
        activityId,
        day
      );
      return {
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 2,
      };
    },
  },
  {
    id: 'figNextSaturday',
    label: 'Rencontre Figurines Samedi prochain',
    color: AOS.style.color,
    backgroundColor: AOS.style.backgroundColor,
    formDataFn: () => {
      const day = calendarService.nextSaturdayGameDay();
      const activityId = 'w40k';
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(
        activityId,
        day
      );
      return {
        dayId: day.id,
        start: '20h',
        roomId: roomChosen.id,
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 2,
      };
    },
  },
  {
    id: 'jdr',
    label: 'Jeu de rôle standard',
    color: JDR.style.color,
    backgroundColor: JDR.style.backgroundColor,
    formDataFn: () => {
      return {
        activityId: 'jdr',
        roomId: 'jdr',
        start: '20h',
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        tables: 2,
      };
    },
  },
  {
    id: 'bigJdr',
    label: 'Grand jeu de rôle (>= 6 joueurs)',
    color: JDR.style.color,
    backgroundColor: JDR.style.backgroundColor,
    formDataFn: () => {
      return {
        activityId: 'jdr',
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
        roomId: 'main',
        start: '19h',
        durationInMinutes: 60,
        description: 'Venez avec quelque chose à partager !',
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
