import { API, type ApiService } from '../api/Api';
import type { AgendaEvent } from '../model/AgendaEvent';
import { fromGameDayId, getEndTime, getStartTime } from '../utils/Utils';

export class AgendaService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  sortEvents(events: AgendaEvent[]): AgendaEvent[] {
    return events.sort((a, b) => a.startTime! - b.startTime!);
  }

  findEventById(eventId: string): Promise<AgendaEvent | null> {
    return this.api.findEventById(eventId);
  }

  findEventsOfDay(dayId: string): Promise<AgendaEvent[]> {
    return this.api.findEventsByDayId(dayId).then(this.sortEvents);
  }

  findEventsOfDayAndRoom(
    dayId: string,
    roomId: string
  ): Promise<AgendaEvent[]> {
    return this.api.findEventsByDayIdAndRoomId(dayId, roomId);
  }

  findAllEvents(): Promise<AgendaEvent[]> {
    return this.api.findAllEvents().then(this.sortEvents);
  }

  saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
    const day = fromGameDayId(event.dayId);
    if (day === null || !event?.durationInMinutes) {
      throw new Error('Unable to save event : ' + event);
    }

    const enriched = {
      ...event,
      startTime: getStartTime(day!, event.start!),
      endTime: getEndTime(day!, event.start!, event.durationInMinutes),
    } as Partial<AgendaEvent>;

    if (event.id) {
      return this.api.updateEvent(enriched);
    } else {
      return this.api.saveEvent(enriched);
    }
  }

  deleteEvent(eventId: string): Promise<void> {
    return this.api.deleteEvent(eventId);
  }
}

export const agendaService = new AgendaService(API);
