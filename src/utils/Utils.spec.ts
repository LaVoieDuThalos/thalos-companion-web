import type { Activity } from '../model/Activity';
import type { AgendaEvent } from '../model/AgendaEvent';
import type { GameDay } from '../model/GameDay';
import {
  clamp,
  eventIsActiveAt,
  eventIsInTimeSlot,
  fromActivityId,
  fromGameDayId,
  fromRoomId,
  getEndTime,
  getStartTime,
  getWeekNumber,
  hourToMinutes,
  isEmpty,
  isNotEmpty,
  isZero,
  minutesToHour,
  parseHour,
  printGameDay,
  removeAll,
  uuid,
} from './Utils';

describe('Utils.isEmpty() tests', () => {
  it('isEmpty should return true when empty string', () => {
    expect(isEmpty('')).toBeTruthy();
  });

  it('isEmpty should return true when null string', () => {
    expect(isEmpty(null)).toBeTruthy();
  });

  it('isEmpty should false true when string', () => {
    expect(isEmpty('string')).toBeFalsy();
  });
});

describe('Utils.isNotEmpty() tests', () => {
  it('isNotEmpty should return true when string', () => {
    expect(isNotEmpty('valid')).toBeTruthy();
  });

  it('isNotEmpty should return false when null string', () => {
    expect(isNotEmpty(null)).toBeFalsy();
  });

  it('isNotEmpty should false true when empty string', () => {
    expect(isNotEmpty('')).toBeFalsy();
  });
});

describe('isZero tests', () => {
  it('Should return successfully', () => {
    expect(isZero(0)).toBeTruthy();
    expect(isZero(undefined)).toBeTruthy();
    expect(isZero(null)).toBeTruthy();
    expect(isZero(1)).toBeFalsy();
  });
});

describe('Start & end Time tests', () => {
  it('Utils.getStartTime()', () => {
    const startTime = getStartTime(
      {
        date: new Date('2025-01-01'),
      } as GameDay,
      '15h'
    );
    expect(new Date(startTime).toISOString()).toBe('2025-01-01T15:00:00.000Z');
    expect(startTime).toBe(1735743600000);
  });

  it('Utils.getEndTime()', () => {
    const endTime = getEndTime(
      {
        date: new Date('2025-01-01'),
      } as GameDay,
      '15h',
      120
    );

    expect(new Date(endTime).toISOString()).toBe('2025-01-01T17:00:00.000Z');
    expect(endTime).toBe(1735750800000);
  });
});

describe('Event is in time slot tests', () => {
  it('Event is after of time slot', () => {
    const event = {
      startTime: new Date('2025-06-01T15:00:00Z').getTime(),
      endTime: new Date('2025-06-01T17:00:00Z').getTime(),
    } as AgendaEvent;
    expect(
      eventIsInTimeSlot(
        event,
        new Date('2025-06-01T12:00:00Z').getTime(),
        new Date('2025-06-01T14:00:00Z').getTime()
      )
    ).toBeFalsy();
  });

  it('Event is before of time slot', () => {
    const event = {
      startTime: new Date('2025-06-01T15:00:00Z').getTime(),
      endTime: new Date('2025-06-01T17:00:00Z').getTime(),
    } as AgendaEvent;
    expect(
      eventIsInTimeSlot(
        event,
        new Date('2025-06-01T17:00:00Z').getTime(),
        new Date('2025-06-01T19:00:00Z').getTime()
      )
    ).toBeFalsy();
  });

  it('Event is completly in the time slot', () => {
    const event = {
      startTime: new Date('2025-06-01T15:00:00Z').getTime(),
      endTime: new Date('2025-06-01T19:00:00Z').getTime(),
    } as AgendaEvent;
    expect(
      eventIsInTimeSlot(
        event,
        new Date('2025-06-01T15:00:00Z').getTime(),
        new Date('2025-06-01T17:00:00Z').getTime()
      )
    ).toBeTruthy();
  });

  it('Event is partially in the time slot', () => {
    const event = {
      startTime: new Date('2025-06-01T14:00:00Z').getTime(),
      endTime: new Date('2025-06-01T16:00:00Z').getTime(),
    } as AgendaEvent;
    expect(
      eventIsInTimeSlot(
        event,
        new Date('2025-06-01T15:00:00Z').getTime(),
        new Date('2025-06-01T17:00:00Z').getTime()
      )
    ).toBeTruthy();
  });

  it('Event is partially in the time slot', () => {
    const event = {
      startTime: new Date('2025-06-01T16:00:00Z').getTime(),
      endTime: new Date('2025-06-01T19:00:00Z').getTime(),
    } as AgendaEvent;
    expect(
      eventIsInTimeSlot(
        event,
        new Date('2025-06-01T15:00:00Z').getTime(),
        new Date('2025-06-01T17:00:00Z').getTime()
      )
    ).toBeTruthy();
  });
});

describe('getWeekNumber tests', () => {
  it('getWeekNumber', () => {
    expect(getWeekNumber(new Date('2025-11-04'))).toBe(45);
    expect(getWeekNumber(new Date('2025-04-11'))).toBe(15);
  });
});

describe('From Id tests', () => {
  it('fromActivityId', () => {
    expect(fromActivityId('jdr')).toBeDefined();
    expect(fromActivityId('jds')?.name).toBe('Jeu de société');
    expect(fromActivityId('unknow')).toBeFalsy();
    expect(fromActivityId('JDR')).toBeFalsy();
    expect(
      fromActivityId('test1', [{ id: 'test1', name: 'Test' } as Activity])
    ).toBeTruthy();

    expect(fromActivityId(undefined)).toBeNull();
  });

  it('fromGameDayId', () => {
    expect(fromGameDayId('2025-11-11')).toBeTruthy();
    expect(fromGameDayId('2025-11-11')?.date.toLocaleDateString()).toBe(
      new Date(2025, 10, 11).toLocaleDateString()
    );
    expect(fromGameDayId(undefined)).toBeNull();
  });

  it('fromRoomId', () => {
    expect(fromRoomId('jdr')).toBeDefined();
    expect(fromRoomId('unknown')).toBeNull();
    expect(fromRoomId(undefined)).toBeNull();
    expect(fromRoomId('JDR')).toBeDefined();
    expect(JSON.stringify(fromRoomId('main'))).toBe(
      '{"id":"main","name":"Grande Salle","capacity":100}'
    );
  });
});

it('printGameDay', () => {
  expect(
    printGameDay({ id: '2025-11-12', date: new Date(2025, 10, 12) } as GameDay)
  ).toBe('Mercredi 12 Novembre 2025');
});

describe('Hour & minutes tests', () => {
  it('parseHour', () => {
    expect(parseHour('12')).toBe('12:00:00');
    expect(parseHour('12h')).toBe('12:00:00');
    expect(parseHour('12H')).toBe('12:00:00');
    expect(parseHour('16h30')).toBe('16:30:00');
    expect(parseHour('16h0')).toBe('16:00:00');
    expect(() => parseHour('16h90')).toThrow('Invalid data');
  });

  it('hourToMinutes', () => {
    expect(hourToMinutes('14h')).toBe(840);
    expect(hourToMinutes('23h59')).toBe(1439);
    expect(hourToMinutes('23')).toBe(1380);
    expect(hourToMinutes('23h30')).toBe(1410);
  });

  it('minutesToHour tests', () => {
    expect(minutesToHour(840)).toBe('14h0');
    //expect(minutesToHour(1410)).toBe('23h30');
  });
});

it('uuid should not be null', () => {
  expect(uuid()).toBeDefined();
  expect(uuid().length).toBe(39);
});

it('clamp tests', () => {
  expect(clamp(200, 100, 110)).toBe(110);
  expect(clamp(200, 201, 110)).toBe(201);
  expect(clamp(200, 199, 201)).toBe(200);
  expect(clamp(200)).toBe(100);
  expect(clamp(-112)).toBe(0);
});

it('remove all tests', () => {
  const result = removeAll(
    ['hello', 'bonjour', 'test', 'hello', 'bonjour'],
    'bonjour'
  );
  expect(JSON.stringify(result)).toBe('["hello","test","hello"]');
});

it('eventIsActiveAt test', () => {
  const event = {
    id: uuid(),
    day: {
      id: '2025-10-11',
      date: new Date(2025, 11, 11),
    } as GameDay,
    start: '14h',
    durationInMinutes: 120,
  } as AgendaEvent;

  expect(eventIsActiveAt(event, '15h')).toBe(true);
  expect(eventIsActiveAt(event, '14h')).toBe(true);
  expect(eventIsActiveAt(event, '13h30')).toBe(false);
  expect(eventIsActiveAt(event, '16h')).toBe(true);
});
