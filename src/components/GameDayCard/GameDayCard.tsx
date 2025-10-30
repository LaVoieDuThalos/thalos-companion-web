import { useContext, useEffect, useState } from 'react';
import { type CardProps } from 'react-bootstrap';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import { agendaService } from '../../services/AgendaService';
import { settingsService } from '../../services/SettingsService';
import { printGameDay } from '../../utils/Utils';
import ActivityIndicator from '../common/ActivityIndicator';
import CustomCard from '../common/CustomCard/CustomCard';
import Icon from '../common/Icon';
import Row from '../common/Row';
import View from '../common/View';

import RoomPriorities from '../RoomPriorities/RoomPriorities';
import './GameDayCard.scss';

type Props = CardProps & {
  day: GameDay;
};

export default function GameDayCard({ day }: Props) {
  const appContext = useContext(AppContext);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const needARefresh =
    appContext.refreshs[`agenda`] || appContext.refreshs[`agenda.${day.id}`];

  useEffect(() => {
    setLoading(true);
    agendaService
      .findEventsOfDay(day.id)
      .then((events) => ({ events, prefs: user.preferences }))
      .then(({ events, prefs }) => {
        const filteredEvents = events.filter(
          (e) =>
            prefs && settingsService.activityVisible(prefs, e.activityId ?? '')
        );
        setEvents(filteredEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [day, needARefresh]);

  return (
    <CustomCard style={{}} className="game-day-card">
      <Row>
        <Icon icon="today" color={'gray'} />
        <span className="game-day">{printGameDay(day)}</span>
      </Row>

      <RoomPriorities day={day} />

      {loading ? <ActivityIndicator color={Colors.red} /> : null}
      <View style={{}}>
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
      </View>
    </CustomCard>
  );
}
