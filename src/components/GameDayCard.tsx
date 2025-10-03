import { useContext, useEffect, useState } from 'react';
import { Card, type CardProps } from 'react-bootstrap';
import { Colors } from '../constants/Colors';
import { AppContext } from '../contexts/AppContext';
import type { AgendaEvent } from '../model/AgendaEvent';
import type { GameDay } from '../model/GameDay';
import { agendaService } from '../services/AgendaService';
import { settingsService } from '../services/SettingsService';
import { printGameDay } from '../utils/Utils';
import ActivityIndicator from './common/ActivityIndicator';
import Icon from './common/Icon';
import View from './common/View';

type Props = CardProps & {
  day: GameDay;
};

export default function GameDayCard({ day }: Props) {
  const appContext = useContext(AppContext);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const needARefresh =
    appContext.refreshs[`agenda`] || appContext.refreshs[`agenda.${day.id}`];

  useEffect(() => {
    setLoading(true);
    settingsService
      .get()
      .then((prefs) =>
        agendaService
          .findEventsOfDay(day.id)
          .then((events) => ({ events, prefs }))
      )
      .then(({ events, prefs }) => {
        const filteredEvents = events.filter((e) =>
          settingsService.activityVisible(prefs, e.activityId ?? '')
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
    <Card style={{}} className="game-day-card">
      <View style={{}}>
        <Icon icon="today" color={'gray'} />
        <span style={{}}>{printGameDay(day)}</span>
      </View>

      {loading ? <ActivityIndicator color={Colors.red} /> : null}
      <View style={{}}>
        {!events || events.length === 0 ? (
          <span style={{}}>Aucun évènement prévu</span>
        ) : null}
        {events &&
          events.map((e) => (
            <span style={{}} key={e.id}>
              {e.start} - {e.activity?.name} : {e.title}
            </span>
          ))}
      </View>
    </Card>
  );
}
