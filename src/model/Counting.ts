import type { GameDayId } from './GameDay.ts';

type Counts = { [key: string]: number };

export interface DayCounts {
  dayId: GameDayId;
  afternoon?: Counts;
  night?: Counts;
}
