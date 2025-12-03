import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import IconButton from '../../components/common/IconButton/IconButton';
import CountingFormModal from '../../components/modals/CountingFormModal/CountingFormModal';
import EventFormModal from '../../components/modals/EventFormModal';
import { ROLE_BUREAU } from '../../constants/Roles';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import { agendaService } from '../../services/AgendaService';
import { calendarService } from '../../services/CalendarService';
import { isPassed, printGameDay } from '../../utils/Utils';

import { Alert } from 'react-bootstrap';
import RoomPriorities from '../../components/RoomPriorities/RoomPriorities';
import View from '../../components/common/View.tsx';
import './GameDayPage.scss';
import CountingsCard from './components/CountingsCard/CountingsCard.tsx';
import GameDayPageTabs from './components/GameDayPageTabs/GameDayPageTabs.tsx';

export default function GameDayPage() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams<{ dayId: string }>();

  const { hasRole } = useUser();
  const [day, setDay] = useState<GameDay | undefined>(undefined);
  const [previousDay, setPreviousDay] = useState<GameDay | null>(null);
  const [nextDay, setNextDay] = useState<GameDay | null>(null);

  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [countingFormModalVisible, setCountingFormModalVisible] =
    useState(false);

  const goPreviousDay = () => {
    navigate(`/agenda/${previousDay?.id}`);
  };

  const goNextDay = () => {
    navigate(`/agenda/${nextDay?.id}`);
  };

  const needARefresh = appContext.refreshs[`agenda.${day?.id}`];

  useEffect(() => {
    setLoading(true);
    setDay({
      id: params.dayId,
      date: new Date(params.dayId + ''),
    } as GameDay);

    agendaService
      .findEventsOfDay(params.dayId + '')
      .then((events) => {
        setEvents(events);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.dayId, needARefresh]);

  useEffect(() => {
    if (day) {
      setPreviousDay(calendarService.previousGameDay(day));
      setNextDay(calendarService.nextGameDay(day));
    }
  }, [day]);

  return (
    <View>
      <EventFormModal
        show={eventFormModalVisible}
        dayId={params.dayId}
        onCancel={() => setEventFormModalVisible(false)}
        onSuccess={(event) => {
          appContext.refresh(`home.events`);
          appContext.refresh(`agenda.${event?.day.id}`);
          setEventFormModalVisible(false);
        }}
      />

      {day && hasRole(ROLE_BUREAU) ? (
        <CountingFormModal
          dayId={day?.id}
          title={`Comptage : ${printGameDay(day)}`}
          show={countingFormModalVisible}
          onCancel={() => setCountingFormModalVisible(false)}
          onSuccess={() => {
            setCountingFormModalVisible(false);
            appContext.refresh(`agenda.${day.id}`);
          }}
        />
      ) : null}

      {/* Sélecteur de la journée */}
      <div key="1" className="day-selector">
        <IconButton icon="arrow_left" onClick={() => goPreviousDay()} />
        {day ? <span className="day-title">{printGameDay(day)}</span> : null}
        <IconButton
          icon="arrow_right"
          color="gray"
          onClick={() => goNextDay()}
        />
      </div>

      {/* Occupation des activités */}
      <Alert variant="info">{day ? <RoomPriorities day={day} /> : null}</Alert>

      {/* Comptages */}
      {day && isPassed(day?.id) && hasRole(ROLE_BUREAU) && (
        <CountingsCard
          day={day}
          onClick={() => setCountingFormModalVisible(true)}
        />
      )}

      {/* Programme / Occupation des salles */}
      <GameDayPageTabs day={day} events={events} loading={loading} />
    </View>
  );
}
