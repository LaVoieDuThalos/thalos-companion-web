import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ActivityIndicator from '../../components/common/ActivityIndicator';
import IconButton from '../../components/common/IconButton/IconButton';
import View from '../../components/common/View';
import CountingFormModal from '../../components/modals/CountingFormModal';
import EventFormModal from '../../components/modals/EventFormModal';
import OpenCloseRoomConfigModal from '../../components/modals/OpenCloseRoomConfigModal';
import { Colors } from '../../constants/Colors';
import { ROLE_BUREAU, ROLE_OUVREUR } from '../../constants/Roles';
import { ROOMS } from '../../constants/Rooms';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import { agendaService } from '../../services/AgendaService';
import { calendarService } from '../../services/CalendarService';
import { settingsService } from '../../services/SettingsService';
import { fromRoomId, printGameDay } from '../../utils/Utils';

import { Form, Nav } from 'react-bootstrap';
import AgendaEventCard from '../../components/AgendaEventCard/AgendaEventCard';
import RoomPlanning from '../../components/RoomPlanning/RoomPlanning';
import RoomPriorities from '../../components/RoomPriorities/RoomPriorities';
import Icon from '../../components/common/Icon';
import Row from '../../components/common/Row';
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
  const [openCloseModalVisible, setOpenCloseModalVisible] = useState(false);

  const [currentRoom, setCurrentRoom] = useState(ROOMS[0]);
  const [currentTab, setCurrentTab] = useState('programme');

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

      {day && settingsService.hasRole(user, ROLE_BUREAU) ? (
        <CountingFormModal
          dayId={day?.id}
          title={`Comptage : ${printGameDay(day)}`}
          show={countingFormModalVisible}
          onCancel={() => setCountingFormModalVisible(false)}
          onSuccess={() => setCountingFormModalVisible(false)}
        />
      ) : null}

      {day && settingsService.hasRole(user, ROLE_OUVREUR) ? (
        <OpenCloseRoomConfigModal
          day={day}
          show={openCloseModalVisible}
          onCancel={() => setOpenCloseModalVisible(false)}
          onSuccess={() => {
            appContext.refresh(`agenda.${day.id}`);
            setOpenCloseModalVisible(false);
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
      <div>
        <Nav
          fill
          variant="tabs"
          defaultActiveKey="programme"
          onSelect={(e) => setCurrentTab(e || 'programme')}
        >
          <Nav.Item>
            <Nav.Link eventKey="programme" title="Programme">
              Programme
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="occupation" title="Occupation des salles">
              Occupation des salles
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {events?.length === 0 ? (
          <View style={{}}>
            <span>Rien de prévu pour l&lsquo;instant</span>
          </View>
        ) : (
          currentTab === 'programme' &&
          events.map((e) => (
            <AgendaEventCard
              key={e.id}
              event={e}
              onPress={() => navigate(`/${e.id}`)}
            />
          ))
        )}
      </div>

      {loading ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : (
        currentTab === 'occupation' && (
          <>
            <hr />
            <Row>
              <Icon icon="table_restaurant" iconSize={20} color={Colors.gray} />
              <span>Salle</span>
              <Form.Select
                onChange={(e) =>
                  setCurrentRoom(() => {
                    const newRoom = fromRoomId(e.target.value);
                    if (!newRoom) {
                      return ROOMS[0];
                    }
                    return newRoom;
                  })
                }
              >
                {ROOMS.map((r) => (
                  <option value={r.id}>{r.name}</option>
                ))}
              </Form.Select>
            </Row>
            {day && (
              <RoomPlanning
                day={day}
                roomId={currentRoom.id}
                events={events.filter((e) => e.roomId === currentRoom.id)}
              />
            )}
          </>
        )
      )}
    </View>
  );
}
