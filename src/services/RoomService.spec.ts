import { expect, test } from 'vitest';
import { RoomService } from './RoomService';
import type { ApiService } from '../api/Api';
import type { OpenCloseRoom } from '../model/Room';

test('isRoomOpenFromDate', async () => {
  const apiMock = {
    findOpenCloseConfiguration: (dayId) =>
      Promise.resolve({ dayId, openAt: '20h' } as OpenCloseRoom),
  } as ApiService;

  const roomService = new RoomService(apiMock);
  expect(
    await roomService.isRoomOpenFromDate(new Date('2026-08-01T20:00:00'))
  ).toBe(true);
  expect(
    await roomService.isRoomOpenFromDate(new Date('2026-08-01T19:00:00'))
  ).toBe(false);
  expect(
    await roomService.isRoomOpenFromDate(new Date('2026-08-01T23:00:00'))
  ).toBe(true);
  expect(
    await roomService.isRoomOpenFromDate(new Date('2026-08-02T00:00:00'))
  ).toBe(false);
});
