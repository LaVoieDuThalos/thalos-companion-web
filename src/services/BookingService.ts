import { ROOMS, TOUTE_LA_SALLE } from '../constants/Rooms';
import type { AgendaEvent } from '../model/AgendaEvent';
import { eventIsInTimeSlot } from '../utils/Utils';
import { agendaService, type AgendaService } from './AgendaService';

export type RoomsOccupation = {
  [key: string]: number;
};

export type TablesAvailables = {
  [key: string]: number;
};

export type EventsByRoom = {
  [key: string]: AgendaEvent[];
};

class BookingService {
  private agendaService: AgendaService;

  constructor(agendaService: AgendaService) {
    this.agendaService = agendaService;
  }

  requestedTables(events: AgendaEvent[]): number {
    return events.map((e) => e.tables || 0).reduce((acc, cur) => acc + cur, 0);
  }

  async availableTablesByRooms(
    dayId: string,
    startTime = 0,
    endTime = 0,
    excludeEventIds: string[] = []
  ): Promise<TablesAvailables> {
    const occupations = await this.findRoomsOccupation(
      dayId,
      startTime,
      endTime,
      excludeEventIds
    );
    return ROOMS.map((room) => {
      const roomCapacity = room.capacity || 0;
      const roomOccupation = occupations[room.id] || 0;
      const count =
        roomCapacity <= roomOccupation
          ? 0
          : roomOccupation > TOUTE_LA_SALLE
            ? TOUTE_LA_SALLE
            : roomCapacity - roomOccupation;
      return {
        [room.id]: count,
      } as TablesAvailables;
    }).reduce((acc, cur) => {
      const roomId = Object.keys(cur)[0];
      if (acc[roomId] !== undefined) {
        acc[roomId] = acc[roomId] + cur[roomId];
      } else {
        acc[roomId] = cur[roomId];
      }
      return acc;
    }, {} as TablesAvailables);
  }

  async findRoomsOccupation(
    dayId: string,
    startTime = 0,
    endTime = 0,
    excludeEventIds: string[] = []
  ): Promise<RoomsOccupation> {
    const events = await this.agendaService.findEventsOfDay(
      dayId,
      excludeEventIds
    );
    const eventsByRoom = events
      .filter((e) =>
        startTime > 0 && endTime > 0
          ? eventIsInTimeSlot(e, startTime, endTime)
          : true
      )
      .reduce((acc: EventsByRoom, cur: AgendaEvent) => {
        if (acc[cur.roomId!]) {
          acc[cur.roomId!].push(cur);
        } else {
          acc[cur.roomId!] = [cur];
        }
        return acc;
      }, {});
    return Object.keys(eventsByRoom)
      .map(
        (roomId) =>
          ({
            [roomId]: this.requestedTables(eventsByRoom[roomId]),
          }) as RoomsOccupation
      )
      .reduce((acc_1, cur_1) => {
        const roomId_1 = Object.keys(cur_1)[0];
        if (acc_1[roomId_1] !== undefined) {
          acc_1 = { ...acc_1, [roomId_1]: acc_1[roomId_1] + cur_1[roomId_1] };
        } else {
          acc_1 = { ...acc_1, [roomId_1]: cur_1[roomId_1] };
        }
        return acc_1;
      }, {} as RoomsOccupation);
  }
}

export const bookingService = new BookingService(agendaService);
