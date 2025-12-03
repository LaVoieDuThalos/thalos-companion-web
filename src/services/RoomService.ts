import { API, type ApiService } from '../api/Api';
import { ACTIVITIES, JDR } from '../constants/Activities';
import { ROOMS, SALLE_JDR } from '../constants/Rooms';
import type { Activity } from '../model/Activity';
import type { GameDay } from '../model/GameDay';
import type { OpenCloseRoom, Room } from '../model/Room';
import { fromGameDayId, getWeekNumber } from '../utils/Utils';

class RoomService {
  private api: ApiService;
  hours: string[] = [];

  constructor(api: ApiService) {
    this.api = api;
    for (let i = 9; i < 24; i++) {
      this.hours.push(`${i}h`);
      this.hours.push(`${i}h30`);
    }
  }

  getActivitiesPriorityOfDay(day: GameDay): Activity[] {
    return getWeekNumber(day.date) % 2 === 0
      ? ACTIVITIES.filter((act) => !act.figurines)
      : ACTIVITIES.filter((act) => act.figurines);
  }

  chooseMeARoomForActivityAndDay(activityId: string, day: GameDay): Room {
    const roomsChosen = this.getPrioritiesRoomsForActivity(activityId, day);
    return roomsChosen[0];
  }

  getPrioritiesRoomsForActivity(activityId: string, day: GameDay): Room[] {
    const activitiesInRoomsA = this.getActivitiesPriorityOfDay(day);
    const roomsA = ROOMS.filter((r) => r.week === 'A');
    const roomsB = ROOMS.filter((r) => r.week === 'B');
    const activityFoundInRoomsA = activitiesInRoomsA.findIndex(
      (act) => act.id === activityId
    );
    return activityFoundInRoomsA ? roomsA : roomsB;
  }

  isActivityAllowedInRoom(
    activityId: string,
    dayId: string,
    roomId: string
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

  async getOpenCloseConfig(dayId: string): Promise<OpenCloseRoom> {
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
