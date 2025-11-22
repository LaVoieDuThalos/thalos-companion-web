import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ActivityIndicator from '../../components/common/ActivityIndicator';
import IconButton from '../../components/common/IconButton/IconButton';
import View from '../../components/common/View';
import CountingFormModal from '../../components/modals/CountingFormModal/CountingFormModal';
import EventFormModal from '../../components/modals/EventFormModal';
import { Colors } from '../../constants/Colors';
import { ROLE_BUREAU } from '../../constants/Roles';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import { agendaService } from '../../services/AgendaService';
import { calendarService } from '../../services/CalendarService';
import { settingsService } from '../../services/SettingsService';
import { isPassed, printGameDay } from '../../utils/Utils';

import { Nav } from 'react-bootstrap';
import CustomCard from '../../components/common/CustomCard/CustomCard';
import Icon from '../../components/common/Icon';
import GameDayPlanning from '../../components/GameDayPlanning/GameDayPlanning';
import GameDayRoomsOccupation from '../../components/GameDayRoomsOccupation/GameDayRoomsOccupation';
import RoomPriorities from '../../components/RoomPriorities/RoomPriorities';
import { type DayCounts } from '../../model/Counting';
import { countingService } from '../../services/CountingService';
import './GameDayPage.scss';

export default function GameDayPage() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams<{ dayId: string }>();

  const { user } = useUser();
  const [day, setDay] = useState<GameDay | null>(null);
  const [previousDay, setPreviousDay] = useState<GameDay | null>(null);
  const [nextDay, setNextDay] = useState<GameDay | null>(null);

  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [countingFormModalVisible, setCountingFormModalVisible] =
    useState(false);

  const [currentTab, setCurrentTab] = useState('programme');
  const [countings, setCountings] = useState<DayCounts | undefined>(undefined);

  const goPrevious = () => {
    navigate(`/agenda/${previousDay?.id}`);
  };

  const goNext = () => {
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

    if (
      params.dayId &&
      settingsService.hasRole(user.preferences, ROLE_BUREAU)
    ) {
      countingService
        .getCounting(params.dayId)
        .then((countings) => setCountings(countings ?? undefined));
    }
  }, [params.dayId, needARefresh]);

  useEffect(() => {
    if (day) {
      setPreviousDay(calendarService.previousGameDay(day));
      setNextDay(calendarService.nextGameDay(day));
    }
  }, [day]);

  return (
    <View style={{}}>
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

      {day && settingsService.hasRole(user.preferences, ROLE_BUREAU) ? (
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

      <div key="1" className="day-selector">
        <IconButton icon="arrow_left" onClick={() => goPrevious()} />
        {day ? <span className="day-title">{printGameDay(day)}</span> : null}
        <IconButton icon="arrow_right" color="gray" onClick={() => goNext()} />
      </div>
      <div className="room-priorities">
        {day ? <RoomPriorities day={day} /> : null}
      </div>
      {day &&
        isPassed(day?.id) &&
        settingsService.hasRole(user.preferences, ROLE_BUREAU) && (
          <CustomCard
            clickable
            onClick={() => setCountingFormModalVisible(true)}
          >
            {!!countings && (
              <Icon icon="check_circle" iconSize={30} color={Colors.green} />
            )}
            <Icon
              icon="123"
              color={countings === undefined ? Colors.gray : Colors.green}
              iconSize={40}
            />
          </CustomCard>
        )}
      <div>
        <Nav
          fill
          variant="tabs"
          defaultActiveKey="programme"
          onSelect={(e) => setCurrentTab(e || 'programme')}
        >
          <Nav.Item>
            <Nav.Link eventKey="programme" title="Programme">
              <Icon icon="event_note" iconSize={20} />
              Programme
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="occupation" title="Occupation des salles">
              <Icon icon="room_preferences" iconSize={20} />
              Occupation des salles
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {loading ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : null}

      {!loading && day && currentTab === 'programme' ? (
        <GameDayPlanning events={events} day={day} />
      ) : null}
      {!loading && currentTab === 'occupation' && day ? (
        <GameDayRoomsOccupation day={day} events={events} />
      ) : null}
    </View>
  );
}
