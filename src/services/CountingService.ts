import { API, type ApiService } from '../api/Api';
import type { DayCounts } from '../model/Counting';
import type { GameDayId } from '../model/GameDay.ts';

class CountingService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  saveOrUpdateCounting(counts: DayCounts): Promise<void> {
    return this.api.saveCountings(counts);
  }

  getCounting(dayId: GameDayId): Promise<DayCounts | null> {
    return this.api.getCountings(dayId);
  }
}

export const countingService = new CountingService(API);
