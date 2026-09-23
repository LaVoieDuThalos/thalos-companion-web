import { API, type ApiService } from '../api/Api';
import type { OpenCloseRoom, Room } from '../model/Room';
import { fromActivityId, gameDayFromDate } from '../utils/Utils';
import { calendarService } from './CalendarService';
import { CASTAGORA, FORUM, SALLE_JDR_CASTAGORA } from '../constants/Rooms.ts';
import { JDR } from '../constants/Activities.ts';

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

  chooseMeARoomForActivityAndDay(activityId: string): Room {
    const activity = fromActivityId(activityId);
    if (activity && activity.figurines) {
      return FORUM;
    } else if (activity?.id === JDR.id) {
      return SALLE_JDR_CASTAGORA;
    }
    return CASTAGORA;
  }

  async isRoomOpenFromDate(date: Date): Promise<boolean> {
    if (!calendarService.isGameDay(date)) {
      return Promise.resolve(false);
    }

    const config = await this.getOpenCloseConfig(gameDayFromDate(date).id);
    return (
      config.openAt
        .padStart(3, '0')
        .localeCompare(`${date.getHours()}h`.padStart(3, '0')) <= 0
    );
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

  getOpenCloseConfigOfMonth(fullYear: number, month: number) {
    return this.api.findOpenCloseConfigurationOfMonth(fullYear, month);
  }
}
export const roomService = new RoomService(API);
