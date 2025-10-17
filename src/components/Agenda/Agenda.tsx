import { useEffect, useState } from 'react';
import IconButton from '../common/IconButton/IconButton';

import { useNavigate } from 'react-router';
import { Months } from '../../constants/Months';
import { type GameDay } from '../../model/GameDay';
import { calendarService } from '../../services/CalendarService';
import { firstDateOfMonth } from '../../utils/Utils';
import GameDayCard from '../GameDayCard/GameDayCard';
import './Agenda.scss';

export default function Agenda() {
  const [current, setCurrent] = useState(firstDateOfMonth());
  const [days, setDays] = useState<GameDay[]>([]);
  const navigate = useNavigate();

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
          <div onClick={() => navigate(`/agenda/${day.id}`)}>
            <GameDayCard key={day.id} day={day} />
          </div>
        ))}
      </div>
    </div>
  );
}
