import type { GameDay } from '../model/GameDay';

const [FRIDAY, SATURDAY] = [5, 6];

class CalendarService {
  private gameDays: number[];

  constructor(gameDays: number[]) {
    this.gameDays = gameDays;
  }

  buildDayId(date: Date) {
    return date.toJSON().slice(0, 10);
  }

  buildDaysFromDate(start: Date, limit = 31, allDays = false, extraDays: GameDay[] = []): GameDay[] {
    const current = start;
    current.setHours(12);
    const result: GameDay[] = [];
    for (let i = 0; i < limit; i++) {
      if (allDays || this.gameDays.includes(start.getDay())) {
        result.push({
          id: this.buildDayId(current),
          date: new Date(current),
        } as GameDay);
      }

      current.setDate(current.getDate() + 1);
    }

    extraDays.filter(day => day !== undefined && result.findIndex(d => day.id === d.id) < 0)
      .forEach(day => {
      result.push(day);
    })

    return result.sort((a, b) => a.id.localeCompare(b.id));
  }

  hours(startHour = 9, mins = [30], addMidnight = false, max = 24): string[] {
    const results = [];
    for (let h = startHour; h < max; h++) {
      results.push(`${h}h`);
      mins.forEach((m) => results.push(`${h}h${m}`));
    }
    if (addMidnight) {
      results.push('Min.');
    }
    return results;
  }

  nextGameDay(current: GameDay): GameDay {
    const date = new Date(current.id);
    date.setDate(current.date.getDate() + 1);
    while (!this.gameDays.includes(date.getDay())) {
      date.setDate(date.getDate() + 1);
    }
    return {
      id: this.buildDayId(date),
      date: date,
    } as GameDay;
  }

  nextFridayGameDay(): GameDay {
    const date = new Date();
    while (date.getDay() != FRIDAY) {
      date.setDate(date.getDate() + 1);
    }
    return {
      id: this.buildDayId(date),
      date: date,
    } as GameDay;
  }

  nextSaturdayGameDay(): GameDay {
    const date = new Date();
    while (date.getDay() != SATURDAY) {
      date.setDate(date.getDate() + 1);
    }
    return {
      id: this.buildDayId(date),
      date: date,
    } as GameDay;
  }

  previousGameDay(current: GameDay): GameDay {
    const date = new Date(current.id);
    date.setDate(current.date.getDate() - 1);
    while (!this.gameDays.includes(date.getDay())) {
      date.setDate(date.getDate() - 1);
    }
    return {
      id: this.buildDayId(date),
      date: date,
    } as GameDay;
  }
}

export const calendarService = new CalendarService([FRIDAY, SATURDAY]);
