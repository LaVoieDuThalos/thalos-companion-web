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

export type TimeInterval = [number, number];

export class BookingService {
  private agendaService: AgendaService;

  constructor(agendaService: AgendaService) {
    this.agendaService = agendaService;
  }

  requestedTables(events: AgendaEvent[], start: number, end: number): number {
    const intervals = this.getAllIntervals(start, end);
    const occupationPerInterval = intervals.map((interval) =>
      events
        .filter((event) => eventIsInTimeSlot(event, interval[0], interval[1]))
        .map((e) => e.tables || 0)
        .reduce((acc, cur) => acc + cur, 0)
    );
    return Math.max(...occupationPerInterval);
  }

  async availableTablesByRooms(
    dayId: string,
    startTime = 0,
    endTime = 0,
    excludeEventIds: string[] = [],
    rooms = ROOMS
  ): Promise<TablesAvailables> {
    const occupations = await this.findRoomsOccupation(
      dayId,
      startTime,
      endTime,
      excludeEventIds
    );
    return rooms
      .map((room) => {
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
      })
      .reduce((acc, cur) => {
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

    const eventsByRoom = this.groupEventsByRoomForInterval(
      events,
      startTime,
      endTime
    );

    return Object.keys(eventsByRoom)
      .map(
        (roomId) =>
          ({
            [roomId]: this.requestedTables(
              eventsByRoom[roomId],
              startTime,
              endTime
            ),
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

  groupEventsByRoomForInterval(
    events: AgendaEvent[],
    startTime: number,
    endTime: number
  ): EventsByRoom {
    return events
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
  }

  getAllIntervals(
    start: number,
    end: number,
    rangeInMinutes = 30
  ): TimeInterval[] {
    const intervalSize = rangeInMinutes * 60 * 1000;
    const intervals = [];
    const intervalCount = (end - start) / intervalSize;

    for (let i = 0; i < Math.ceil(intervalCount); i++) {
      const intervalStart = start + i * intervalSize;
      const intervalEnd = intervalStart + intervalSize;
      intervals.push([intervalStart, intervalEnd] as TimeInterval);
    }
    return intervals;
  }
}

export const bookingService = new BookingService(agendaService);
