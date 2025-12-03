import type { AgendaEvent } from '../model/AgendaEvent.ts';

// Filtre les events d'une journée donnée
export function getAllEventsOfDay(dayId: string, events: AgendaEvent[]){
  return events.filter((e) => e.day.id === dayId);
}