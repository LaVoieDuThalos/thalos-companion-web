import { useEffect, useState } from 'react';
import IconButton from '../common/IconButton/IconButton';

import { Months } from '../../constants/Months';
import { type AgendaEvent } from '../../model/AgendaEvent';
import { type GameDay } from '../../model/GameDay';
import { agendaService } from '../../services/AgendaService';
import { calendarService } from '../../services/CalendarService';
import { firstDateOfMonth } from '../../utils/Utils';
import GameDayCard from '../GameDayCard/GameDayCard';
import './Agenda.scss';

const getAllEventsOfDay = (dayId: string, events: AgendaEvent[]) => {
  return events.filter((e) => e.day.id === dayId);
};

export default function Agenda() {
  const [current, setCurrent] = useState(firstDateOfMonth());
  const [days, setDays] = useState<GameDay[]>([]);
  const [eventsOfMonth, setEventsOfMonth] = useState<AgendaEvent[]>([]);

  const incMonth = (inc: number) => {
    const month = current.getMonth() + inc;
    if (month > 11) {
      setCurrent((prev) => new Date(prev.getFullYear() + 1, 0, 1));
    } else if (month < 0) {
      setCurrent((prev) => new Date(prev.getFullYear() - 1, 11, 1));
    } else {
      setCurrent((prev) => new Date(prev.getFullYear(), month, 1));
    }
  };

  useEffect(() => {
    setDays(
      calendarService.buildDaysFromDate(
        new Date(current.getFullYear(), current.getMonth(), current.getDate())
      )
    );

    agendaService
      .findEventsOfMonth(current.getFullYear(), current.getMonth() + 1)
      .then((events) => setEventsOfMonth(events));
  }, [current]);

  return (
    <div className="agenda-main">
      <div className="month-selector">
        <IconButton icon="arrow_left" onClick={() => incMonth(-1)} />
        <div className="month-label">
          {Months[current.getMonth()]} {current.getFullYear()}
        </div>
        <IconButton icon="arrow_right" onClick={() => incMonth(1)} />
      </div>
      <div className="month-days">
        {days.map((day) => (
          <GameDayCard
            key={day.id}
            day={day}
            events={getAllEventsOfDay(day.id, eventsOfMonth)}
          />
        ))}
      </div>
    </div>
  );
}
