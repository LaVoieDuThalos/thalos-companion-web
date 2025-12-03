import { type CardProps, Row } from 'react-bootstrap';

import { useNavigate } from 'react-router';
import './GameDayCard.scss';
import type { GameDay } from '../../../../model/GameDay.ts';
import type { AgendaEvent } from '../../../../model/AgendaEvent.ts';
import CustomCard from '../../../../components/common/CustomCard/CustomCard.tsx';
import Icon from '../../../../components/common/Icon.tsx';
import { printGameDay } from '../../../../utils/Utils.ts';
import RoomPriorities from '../../../../components/RoomPriorities/RoomPriorities.tsx';

type Props = CardProps & {
  day: GameDay;
  events: AgendaEvent[];
};

export default function GameDayCard({ day, events }: Props) {
  const navigate = useNavigate();
  return (
    <CustomCard
      className="game-day-card"
      clickable
      onClick={() => navigate(`/agenda/${day.id}`)}
    >
      <Row>
        <Icon icon="today" iconSize={22} color={'gray'} />
        <span className="game-day">{printGameDay(day)}</span>
      </Row>

      <RoomPriorities day={day} />

      <div className="events">
        {!events || events.length === 0 ? (
          <span style={{}}>Aucun évènement prévu</span>
        ) : null}
        {events &&
          events.map((e) => (
            <div
              className={`event event-${e.activity?.id}`}
              key={e.id}
              style={{
                backgroundColor: e.activity?.style.backgroundColor,
                color: e.activity?.style.color,
              }}
            >
              <span className="event-start">{e.start}</span> -{' '}
              <span className="event-room">[{e.room?.name}]</span> -{' '}
              <span className="event-activity">{e.activity?.name}</span> :{' '}
              <span className="event-title">{e.title}</span>
            </div>
          ))}
      </div>
    </CustomCard>
  );
}
