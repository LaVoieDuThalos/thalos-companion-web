import { useContext, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import AgendaEventCard from '../../components/AgendaEventCard/AgendaEventCard';
import ActivityIndicator from '../../components/common/ActivityIndicator';
import Icon from '../../components/common/Icon';
import IconButton from '../../components/common/IconButton/IconButton';
import View from '../../components/common/View';
import CountingFormModal from '../../components/modals/CountingFormModal';
import EventFormModal from '../../components/modals/EventFormModal';
import OpenCloseRoomConfigModal from '../../components/modals/OpenCloseRoomConfigModal';
import OpenAndCloseRoom from '../../components/OpenAndCloseRoom';
import RoomPriorities from '../../components/RoomPriorities/RoomPriorities';
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
import { printGameDay } from '../../utils/Utils';

import Row from '../../components/common/Row';
import RoomOccupation from '../../components/RoomOccupation/RoomOccupation';
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

  const goPrevious = () => {
    navigate(`/agenda/${previousDay?.id}`);
  };

  const goNext = () => {
    navigate(`/agenda/${nextDay?.id}`);
  };

  const realRooms = ROOMS.filter((r) => !r.virtual);

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
      {loading ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : (
        <>
          <div style={{}}>
            <div onClick={() => setOpenCloseModalVisible(true)}>
              {day && settingsService.hasRole(user, ROLE_OUVREUR) ? (
                <OpenAndCloseRoom day={day} />
              ) : null}
            </div>
            {events?.length === 0 ? (
              <View style={{}}>
                <span>Rien de prévu pour l&lsquo;instant</span>
              </View>
            ) : (
              events.map((e) => (
                <AgendaEventCard
                  key={e.id}
                  event={e}
                  onPress={() => navigate(`/${e.id}`)}
                />
              ))
            )}
            <View style={{}}>
              {/*<IconButton
                icon="add"
                color={'white'}
                onClick={() => setEventFormModalVisible(true)}
              />*/}
              {settingsService.hasRole(user, ROLE_BUREAU) && (
                <IconButton
                  icon="pin"
                  iconSize={50}
                  color={'white'}
                  onClick={() => setCountingFormModalVisible(true)}
                />
              )}
            </View>
            <View>
              <hr />
              <Row>
                <Icon
                  icon="table_restaurant"
                  iconSize={20}
                  color={Colors.gray}
                />
                <span>Occupation des salles</span>
              </Row>

              <Nav justify variant="tabs" defaultActiveKey="main">
                {realRooms.map((r) => (
                  <Nav.Item>
                    <Nav.Link
                      eventKey={r.id}
                      href="/home"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentRoom(r);
                      }}
                    >
                      <Icon icon="location_on" iconSize={20} />
                      {r.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              {day && (
                <>
                  <RoomOccupation
                    day={day}
                    room={currentRoom}
                    events={events.filter((e) => e.room?.id === currentRoom.id)}
                  />
                </>
              )}
            </View>
          </div>
        </>
      )}
    </View>
  );
}
