import type { Activity } from '../model/Activity';
import type { Room } from '../model/Room';
import { mapAgendaEventToDto, mapDtoToAgendaEvent } from './Mappers';

describe('Mappers tests', () => {
  const rooms: Room[] = [
    {
      id: 'room1',
      name: 'Room A',
      capacity: 10,
    },
    {
      id: 'room2',
      name: 'Room B',
      capacity: 15,
    },
    {
      id: 'room3',
      name: 'Room C',
      capacity: 20,
    },
  ];

  const activities: Activity[] = [
    {
      id: 'activity1',
      name: 'Activity A',
      style: {
        backgroundColor: 'yellow',
        color: 'white',
      },
    },
    {
      id: 'activity2',
      name: 'Activity B',
      style: {
        backgroundColor: 'red',
        color: 'white',
      },
    },
  ];

  it('mapDtoToAgendaEvent should map to event', () => {
    expect(
      mapDtoToAgendaEvent(
        'id',
        {
          dayId: '2025-01-02',
          activityId: 'activity2',
          roomId: 'room1',
          creator: {
            id: 'user1',
          },
          description: 'description',
          durationInMinutes: 100,
          start: '15H',
          title: 'Test',
          tables: 4,
          startTime: 123456,
          endTime: 223456,
        },
        rooms,
        activities
      )
    ).toMatchSnapshot();
  });

  it('mapAgendaEventToDto should map to dto', () => {
    expect(
      mapAgendaEventToDto({
        activityId: 'activity2',
        activity: {
          id: 'activity2',
          name: 'Activity B',
          style: {
            backgroundColor: 'red',
            color: 'white',
          },
        },
        creator: {
          id: 'user1',
        },
        dayId: '2025-01-02',
        day: {
          date: new Date('2025-01-02T00:00:00.000Z'),
          id: '2025-01-02',
        },
        description: 'description',
        durationInMinutes: 100,
        endTime: 223456,
        id: 'id',
        roomId: 'room1',
        room: {
          capacity: 10,
          id: 'room1',
          name: 'Room A',
        },
        start: '15h',
        startTime: 123456,
        tables: 4,
        title: 'Test',
      })
    ).toMatchSnapshot();
  });
});
