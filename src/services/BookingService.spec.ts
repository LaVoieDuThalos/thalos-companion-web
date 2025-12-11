import { BookingService } from './BookingService.ts';
import { vi } from 'vitest';
import { agendaService } from './AgendaService.ts';
import type { AgendaEvent } from '../model/AgendaEvent.ts';

const EVENTS = [
  {
    id: 'auberge',
    title: 'Auberge Espagnole',
    dayId: '2025-12-13',
    roomId: 'main',
    startTime: 1765652400000,
    endTime: 1765656000000,
    tables: 9
  } as AgendaEvent,
  {
    id: 'jdr',
    title: 'JDR',
    dayId: '2025-12-13',
    roomId: 'main',
    startTime: 1765657800000,
    endTime: 1765717740000,
    tables: 1
  } as AgendaEvent,
  {
    id: 'w40k',
    title: 'Warhammer',
    dayId: '2025-12-13',
    roomId: 'main',
    startTime: 1765656000000,
    endTime: 1765715940000,
    tables: 8
  } as AgendaEvent
];

it('findRoomsOccupation', async () => {
  vi.spyOn(agendaService, 'findEventsOfDay')
    .mockImplementation(() => Promise.resolve(EVENTS));
  const bookingService = new BookingService(agendaService);
  // 9h30 -> Minuit
  const occupations = await bookingService.findRoomsOccupation('2025-12-13', 1765620000000, 1765679940000, []);
  expect(occupations['main']).toBe(9);
  vi.resetAllMocks();
})

it('availableTablesByRooms', async () => {
  vi.spyOn(agendaService, 'findEventsOfDay')
    .mockImplementation(() => Promise.resolve(EVENTS));
  const bookingService = new BookingService(agendaService);

  const availableByRooms = await bookingService.availableTablesByRooms('2025-12-13', 1765620000000, 1765679940000, []);

  expect(availableByRooms['main']).toBe(1);
  expect(availableByRooms['jdr']).toBe(2);
  expect(availableByRooms['annexe']).toBe(8);
  expect(availableByRooms['algeco']).toBe(10);
  expect(availableByRooms['sdl']).toBe(90);
  expect(availableByRooms['autre']).toBe(0);

  vi.resetAllMocks();
})

it('getAllIntervals', () => {

  const service = new BookingService(agendaService);

  const intervals = service.getAllIntervals(1765620000000, 1765679940000, 30);

  expect(intervals.length).toBe(34);
})