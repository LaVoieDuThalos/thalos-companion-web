import { useRef } from 'react';
import type { Room } from '../../model/Room';
import { calendarService } from '../../services/CalendarService';

import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import './RoomOccupation.scss';

type Props = {
  day: GameDay;
  room: Room;
  events: AgendaEvent[];
};

export default function RoomOccupation(props: Props) {
  const startHour = 9;
  const hours = calendarService.hours(startHour, [], true);

  const timelineRef = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <div className="timeline">
        {hours.map((hh) => (
          <div className="hour">{hh}</div>
        ))}
      </div>
      <div className="events" ref={timelineRef}>
        {props.events.map((e) => (
          <p>{e.title}</p>
        ))}
      </div>
    </div>
  );
}
