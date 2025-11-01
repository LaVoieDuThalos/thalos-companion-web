import { calendarService } from '../services/CalendarService';
import { roomService } from '../services/RoomService';
import { JUSQUA_LA_FERMETURE } from './Durations';

type InitFormData = { [key: string]: unknown };

export type EventCreationMode = {
  id: string;
  label: string;
  variant?: string;
  formDataFn: () => InitFormData;
};

export const CREATION_MODES: EventCreationMode[] = [
  {
    id: 'w40kNextFriday',
    label: 'Rencontre Warhammer 40K Vendredi prochain',
    variant: 'primary',
    formDataFn: () => {
      const day = calendarService.nextFridayGameDay();
      const activityId = 'w40k';
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(
        activityId,
        day
      );
      return {
        title: 'Rencontre W40K',
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
    variant: 'primary',
    formDataFn: () => {
      const day = calendarService.nextSaturdayGameDay();
      const activityId = 'w40k';
      const roomChosen = roomService.chooseMeARoomForActivityAndDay(
        activityId,
        day
      );
      return {
        title: 'Rencontre W40K ',
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
    id: 'jdr',
    label: 'Jeu de rôle standard',
    variant: 'primary',
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
    variant: 'primary',
    formDataFn: () => {
      return {
        activityId: 'jdr',
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
