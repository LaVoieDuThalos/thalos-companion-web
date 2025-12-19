import { useEffect, useState } from 'react';

import IconButton from '../../components/common/IconButton/IconButton.tsx';
import { Months } from '../../constants/Months';
import { type AgendaEvent } from '../../model/AgendaEvent';
import { type GameDay } from '../../model/GameDay';
import { agendaService } from '../../services/AgendaService';
import { calendarService } from '../../services/CalendarService';
import { getAllEventsOfDay } from '../../utils/AgendaUtils.ts';
import { firstDateOfMonth } from '../../utils/Utils';
import './AgendaPage.scss';
import GameDayCard from './components/GameDayCard/GameDayCard.tsx';
import { roomService } from '../../services/RoomService.ts';
import type { OpenCloseRoom } from '../../model/Room.ts';

const JANUARY = 0;
const DECEMBER = 11;

function getOpenCloseOfDay(dayId: string, data: OpenCloseRoom[]): OpenCloseRoom | undefined {
  return data.find(d => d.dayId === dayId);
}

export default function AgendaPage() {
  const [current, setCurrent] = useState(firstDateOfMonth());
  const [days, setDays] = useState<GameDay[]>([]);
  const [eventsOfMonth, setEventsOfMonth] = useState<AgendaEvent[]>([]);
  const [openCloseOfMonth, setOpenCloseOfMonth] = useState<OpenCloseRoom[]>([]);

  const incMonth = (inc: number) => {
    const month = current.getMonth() + inc;
    if (month > DECEMBER) {
      setCurrent((prev) => new Date(prev.getFullYear() + 1, 0, 1));
    } else if (month < JANUARY) {
      setCurrent((prev) => new Date(prev.getFullYear() - 1, DECEMBER, 1));
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
      .then((events) => {
        setEventsOfMonth(events);
      });

    roomService.getOpenCloseConfigOfMonth(current.getFullYear(), current.getMonth() + 1)
      .then(openCloseOfMonth => setOpenCloseOfMonth(openCloseOfMonth));
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
            openClose={getOpenCloseOfDay(day.id, openCloseOfMonth)}
          />
        ))}
      </div>
    </div>
  );
}
