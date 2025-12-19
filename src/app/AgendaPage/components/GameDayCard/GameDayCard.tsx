import { type CardProps } from 'react-bootstrap';

import { useNavigate } from 'react-router';
import './GameDayCard.scss';
import type { GameDay } from '../../../../model/GameDay.ts';
import type { AgendaEvent } from '../../../../model/AgendaEvent.ts';
import CustomCard from '../../../../components/common/CustomCard/CustomCard.tsx';
import Icon from '../../../../components/common/Icon.tsx';
import { printGameDay } from '../../../../utils/Utils.ts';
import RoomPriorities from '../../../../components/RoomPriorities/RoomPriorities.tsx';
import type { OpenCloseRoom } from '../../../../model/Room.ts';
import { Colors } from '../../../../constants/Colors.ts';
import Label from '../../../../components/common/Label.tsx';

type Props = CardProps & {
  day: GameDay;
  events: AgendaEvent[];
  openClose?: OpenCloseRoom;
};

export default function GameDayCard({ day, events, openClose }: Props) {
  const navigate = useNavigate();
  return (
    <CustomCard
      className="game-day-card"
      clickable
      onClick={() => navigate(`/agenda/${day.id}`)}
    >
      <div className="game-day-card-header">
        <div className="day">
          <Icon icon="today" iconSize={22} color={'gray'} />
          <span className="game-day">{printGameDay(day)}</span>
        </div>
        {openClose ? <div className="open-close-room-infos">
          <Label
            icon="schedule"
            size={20}
            styles={{ fontWeight: 'bold', color: Colors.red }}
          >{openClose.openAt}</Label></div> : null}
      </div>

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
