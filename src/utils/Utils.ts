import { ACTIVITIES } from '../constants/Activities';
import {
  EVENT_SUBSCRIPTION_MODES,
  type EventSubscriptionMode,
} from '../constants/EventSubscriptionModes';
import { DaysOfWeek, Months } from '../constants/Months';
import { ROOMS } from '../constants/Rooms';
import type { Activity } from '../model/Activity';
import type { AgendaEvent } from '../model/AgendaEvent';
import type { GameDay } from '../model/GameDay';
import type { Room } from '../model/Room';

export function isEmpty(
  value: string | null | undefined,
  emptyValues = ['']
): boolean {
  return !value || emptyValues.filter((v) => value.trim() === v).length > 0;
}

export function isNotEmpty(value: string | null): boolean {
  return !isEmpty(value);
}

export function isZero(value: number | undefined | null): boolean {
  return !value || false || isNaN(value) || value === 0;
}

export function fromActivityId(
  id: string | undefined,
  activities = ACTIVITIES
): Activity | null {
  if (id === undefined) {
    return null;
  }
  return activities.find((a) => a.id === id) ?? null;
}

export function fromGameDayId(id: string | undefined): GameDay | null {
  if (!id) {
    return null;
  }
  const date = new Date(id);
  return {
    id,
    date,
  } as GameDay;
}

export function fromSubscriptionModeId(
  modeId: string
): EventSubscriptionMode | undefined {
  return EVENT_SUBSCRIPTION_MODES.find((m) => m.id === modeId);
}

export function isPassed(day: string): boolean {
  const d = new Date(day);
  const now = new Date();
  return now.getTime() - d.getTime() > 0;
}

export function printGameDay(gameDay: GameDay): string {
  const day = DaysOfWeek[gameDay.date.getDay()];
  const dom = gameDay.date.getDate();
  const month = Months[gameDay.date.getMonth()];
  const yyyy = gameDay.date.getFullYear();
  return `${day} ${dom} ${month} ${yyyy}`;
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return (
    d.toLocaleDateString() +
    ' - ' +
    `${d.getHours()}`.padStart(2, '0') +
    ':' +
    `${d.getMinutes()}`.padStart(2, '0')
  );
}

export function parseHour(hour: string): string {
  const hh = hour.toUpperCase().split('H');
  if (
    parseInt(hh[0]) < 0 ||
    parseInt(hh[0]) > 23 ||
    parseInt(hh[1]) < 0 ||
    parseInt(hh[1]) > 59
  ) {
    throw Error('Invalid data');
  }
  return `${hh[0].padStart(2, '0')}:${hh.length > 1 ? hh[1].padStart(2, '0') : '00'}:00`;
}

export function hourToMinutes(hour: string): number {
  const hh = hour.toUpperCase().split('H');
  return (
    60 * parseInt(hh[0]) + (hh.length > 1 && hh[1] !== '' ? parseInt(hh[1]) : 0)
  );
}

export function minutesToHour(minutes: number): string {
  const hh = minutes / 60;
  let min = 0;
  if (minutes % 60 !== 0) {
    min = 30;
  }
  return `${hh}h${min}`;
}

export function getStartTime(day: GameDay, start: string): number {
  return day.date.getTime() + hourToMinutes(start) * 60 * 1000;
}

export function getEndTime(
  day: GameDay,
  start: string,
  durationInMinutes: number
): number {
  return getStartTime(day, start) + durationInMinutes * 60 * 1000;
}

export function eventIsInTimeSlot(
  event: AgendaEvent,
  start: number,
  end: number
): boolean {
  const eventStartTime = event.startTime || 0;
  const eventEndTime = event.endTime || 0;
  return (
    (eventStartTime <= start && eventEndTime <= end && eventEndTime > start) ||
    (eventStartTime >= start && eventStartTime < end && eventEndTime >= end) ||
    (eventStartTime <= start && eventEndTime >= end)
  );
}

export function fromRoomId(
  roomId: string | undefined,
  rooms = ROOMS
): Room | null {
  if (roomId === undefined) {
    return null;
  }
  return rooms.find((r) => r.id === roomId) ?? null;
}

export function removeAll(arr: string[], value: string): string[] {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

export function eventIsActiveAt(event: AgendaEvent, hour: string): boolean {
  const hh = parseHour(hour);
  const startEvent = parseHour(event.start);
  const hhMinutes = hourToMinutes(event.start);
  const endEventInMinutes = hhMinutes + event.durationInMinutes;
  const endEvent = minutesToHour(endEventInMinutes);

  return startEvent.localeCompare(hh) <= 0 && endEvent.localeCompare(hh) > 0;
}

export function clamp(value: number, min = 0, max = 100): number {
  return value < min ? min : value > max ? max : value;
}

export function uuid() {
  return [8, 5, 5, 5, 12]
    .map((n) => {
      let res = '';
      for (let i = 0; i < n; i++)
        res += Math.floor(Math.random() * 16).toString(16);
      return res;
    })
    .join('-');
}

export function getWeekNumber(day: Date): number {
  const date = new Date(day);

  // ISO week date weeks start on Monday, so correct the day number
  const nDay = (date.getDay() + 6) % 7;

  // ISO 8601 states that week 1 is the week with the first Thursday of that year
  // Set the target date to the Thursday in the target week
  date.setDate(date.getDate() - nDay + 3);

  // Store the millisecond value of the target date
  const n1stThursday = date.valueOf();

  // Set the target to the first Thursday of the year
  // First, set the target to January 1st
  date.setMonth(0, 1);

  // Not a Thursday? Correct the date to the next Thursday
  if (date.getDay() !== 4) {
    date.setMonth(0, 1 + ((4 - date.getDay() + 7) % 7));
  }

  // The week number is the number of weeks between the first Thursday of the year
  // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
  return 1 + Math.ceil((n1stThursday - date.getTime()) / 604800000);
}

export function firstDateOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function nowMinusDays(days: number): Date {
  const now = new Date();
  now.setDate(now.getDate() - days);
  return now;
}

export function printDuration(durationInMinutes: number): string {
  if (durationInMinutes < 60) {
    return `${durationInMinutes} minutes`;
  } else {
    const minutes = durationInMinutes % 60;
    return `${durationInMinutes / 60}h${minutes != 0 ? minutes + 'min' : ''}`;
  }
}
