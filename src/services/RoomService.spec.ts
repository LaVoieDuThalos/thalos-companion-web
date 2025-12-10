import { RoomService } from './RoomService.ts';
import { fromGameDayId } from '../utils/Utils.ts';
import type { ApiService } from '../api/Api.ts';
import { vi } from 'vitest';
import { firestoreApi } from '../api/FirestoreApi.ts';
import { AOS, BLOODBOWL, JDR, JDS_ACTIVITY, SHATTERPOINT, WARHAMMER_40K } from '../constants/Activities.ts';
import { ALGECO, GRANDE_SALLE, SALLE_ANNEXE, SALLE_JDR } from '../constants/Rooms.ts';

describe('RoomService Tests', () => {

  const mockedApi = vi.mockObject<ApiService>(firestoreApi);

  const service = new RoomService(mockedApi);

  it('getActivitiesPriorityOfDay', () => {
    const resultsWeekA = service.getActivitiesPriorityOfDay(fromGameDayId('2025-11-11')!);
    expect(resultsWeekA.length).toBe(4);
    expect(resultsWeekA[0]).toBe(WARHAMMER_40K);
    expect(resultsWeekA[1]).toBe(AOS);
    expect(resultsWeekA[2]).toBe(BLOODBOWL);
    expect(resultsWeekA[3]).toBe(SHATTERPOINT);

    const resultsWeekB = service.getActivitiesPriorityOfDay(fromGameDayId('2025-11-19')!);
    expect(resultsWeekB.length).toBe(9);
    expect(resultsWeekB[0]).toBe(JDS_ACTIVITY);
    expect(resultsWeekB[1]).toBe(JDR);
  })

  it('chooseMeARoomForActivityAndDay', () => {
    expect(service.chooseMeARoomForActivityAndDay(WARHAMMER_40K.id, fromGameDayId('2025-11-11')!)).toBe(GRANDE_SALLE);
    expect(service.chooseMeARoomForActivityAndDay(JDS_ACTIVITY.id, fromGameDayId('2025-11-11')!)).toBe(ALGECO);
    expect(service.chooseMeARoomForActivityAndDay(JDR.id, fromGameDayId('2025-11-11')!)).toBe(ALGECO);
  });

  it('getPrioritiesRoomsForActivity', () => {
    const rooms = service.getPrioritiesRoomsForActivity(WARHAMMER_40K.id, fromGameDayId('2025-11-11')!);
    expect(rooms.length).toBe(2);
    expect(rooms[0]).toBe(GRANDE_SALLE);
    expect(rooms[1]).toBe(SALLE_ANNEXE);
  })

  it('isActivityAllowedInRoom', () => {
    expect(service.isActivityAllowedInRoom(WARHAMMER_40K.id, '2025-11-11', GRANDE_SALLE.id)).toBeTruthy();
    expect(service.isActivityAllowedInRoom(AOS.id, '2025-11-11', GRANDE_SALLE.id)).toBeTruthy();
    expect(service.isActivityAllowedInRoom(AOS.id, '2025-11-11', SALLE_ANNEXE.id)).toBeTruthy();
    expect(service.isActivityAllowedInRoom(BLOODBOWL.id, '2025-11-11', GRANDE_SALLE.id)).toBeTruthy();
    expect(service.isActivityAllowedInRoom(SHATTERPOINT.id, '2025-11-11', GRANDE_SALLE.id)).toBeTruthy();
    expect(service.isActivityAllowedInRoom(JDR.id, '2025-11-11', SALLE_JDR.id)).toBeTruthy();
    expect(service.isActivityAllowedInRoom(JDS_ACTIVITY.id, '2025-11-11', ALGECO.id)).toBeTruthy();
  })
})