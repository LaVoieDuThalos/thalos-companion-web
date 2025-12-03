import { API, type ApiService } from '../api/Api';
import type { AgendaEvent } from '../model/AgendaEvent';
import { fromGameDayId, getEndTime, getStartTime } from '../utils/Utils';
import { subscriptionService } from './SubscriptionService';

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

  async findEventsOfDay(
    dayId: string,
    excludeEventIds: string[] = [],
  ): Promise<AgendaEvent[]> {
    const events = await this.api
      .findEventsByDayId(dayId);
    const events_1 = events.filter((e) => excludeEventIds.indexOf(e.id) < 0);
    return this.sortEvents(events_1);
  }

  async findEventsOfMonth(year: number, month: number): Promise<AgendaEvent[]> {
    const events = await this.api.findAllEventsOfMonth(year, month);
    return this.sortEvents(events);
  }

  findEventsOfDayAndRoom(
    dayId: string,
    roomId: string
  ): Promise<AgendaEvent[]> {
    return this.api.findEventsByDayIdAndRoomId(dayId, roomId);
  }

  async findAllEvents(): Promise<AgendaEvent[]> {
    const events = await this.api.findAllEvents();
    return this.sortEvents(events);
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

  async deleteEvent(eventId: string): Promise<void> {
    await this.api
      .deleteEvent(eventId);
    return await subscriptionService.unsubscribeAll(eventId);
  }
}

export const agendaService = new AgendaService(API);
