import { API, type ApiService } from '../api/Api';
import { ACTIVITIES, JDR } from '../constants/Activities';
import { ROOMS, SALLE_JDR } from '../constants/Rooms';
import type { Activity, ActivityId } from '../model/Activity';
import type { GameDay, GameDayId } from '../model/GameDay';
import type { OpenCloseRoom, Room, RoomId } from '../model/Room';
import { fromGameDayId, getWeekNumber } from '../utils/Utils';

export class RoomService {
  private api: ApiService;
  hours: string[] = [];

  constructor(api: ApiService) {
    this.api = api;
    for (let i = 9; i < 24; i++) {
      this.hours.push(`${i}h`);
      this.hours.push(`${i}h30`);
    }
  }

  getActivitiesPriorityOfDay(day: GameDay, activities = ACTIVITIES): Activity[] {
    return getWeekNumber(day.date) % 2 === 0
      ? activities.filter((act) => act.figurines)
      : activities.filter((act) => !act.figurines);
  }

  chooseMeARoomForActivityAndDay(activityId: ActivityId, day: GameDay, rooms = ROOMS): Room {
    const roomsChosen = this.getPrioritiesRoomsForActivity(activityId, day, rooms);
    return roomsChosen[0];
  }

  getPrioritiesRoomsForActivity(activityId: ActivityId, day: GameDay, rooms = ROOMS): Room[] {
    const activitiesInRoomsA = this.getActivitiesPriorityOfDay(day);
    const roomsA = rooms.filter((r) => r.week === 'A');
    const roomsB = rooms.filter((r) => r.week === 'B');
    const activityFoundInRoomsA = activitiesInRoomsA.findIndex(
      (act) => act.id === activityId
    ) >= 0;
    return activityFoundInRoomsA ? roomsA : roomsB;
  }

  isActivityAllowedInRoom(
    activityId: ActivityId,
    dayId: GameDayId,
    roomId: RoomId
  ): boolean {
    const day = fromGameDayId(dayId);
    if (!day) {
      return false;
    }
    if (activityId === JDR.id && roomId === SALLE_JDR.id) {
      return true;
    }
    const roomsChosen = this.getPrioritiesRoomsForActivity(activityId, day);
    return roomsChosen.map((r) => r.id).indexOf(roomId) >= 0;
  }

  async getOpenCloseConfig(dayId: GameDayId): Promise<OpenCloseRoom> {
    const result = await this.api.findOpenCloseConfiguration(dayId);
    if (result == null) {
      return {
        dayId,
        openAt: '20h',
      } as OpenCloseRoom;
    } else {
      return result;
    }
  }

  saveOpenCloseConfig(config: OpenCloseRoom): Promise<void> {
    return this.api.saveOpenCloseConfiguration(config);
  }
}
export const roomService = new RoomService(API);
