import { useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import AgendaEventCard from '../components/AgendaEventCard/AgendaEventCard';
import ActivityIndicator from '../components/common/ActivityIndicator';
import Icon from '../components/common/Icon';
import IconButton from '../components/common/IconButton/IconButton';
import View from '../components/common/View';
import CountingFormModal from '../components/modals/CountingFormModal';
import EventFormModal from '../components/modals/EventFormModal';
import OpenCloseRoomConfigModal from '../components/modals/OpenCloseRoomConfigModal';
import OccupationStats from '../components/OccupationStats';
import OpenAndCloseRoom from '../components/OpenAndCloseRoom';
import RoomPriorities from '../components/RoomPriorities';
import { Colors } from '../constants/Colors';
import { ROOMS } from '../constants/Rooms';
import { AppContext } from '../contexts/AppContext';
import type { AgendaEvent } from '../model/AgendaEvent';
import type { GameDay } from '../model/GameDay';
import { agendaService } from '../services/AgendaService';
import { calendarService } from '../services/CalendarService';
import { printGameDay } from '../utils/Utils';

export default function GameDayPage() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams<{ dayId: string }>();
  const [day, setDay] = useState<GameDay | null>(null);
  const [previousDay, setPreviousDay] = useState<GameDay | null>(null);
  const [nextDay, setNextDay] = useState<GameDay | null>(null);

  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [countingFormModalVisible, setCountingFormModalVisible] =
    useState(false);
  const [openCloseModalVisible, setOpenCloseModalVisible] = useState(false);

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

      {day ? (
        <CountingFormModal
          dayId={day?.id}
          title={`Comptage : ${printGameDay(day)}`}
          show={countingFormModalVisible}
          onCancel={() => setCountingFormModalVisible(false)}
          onSuccess={() => setCountingFormModalVisible(false)}
        />
      ) : null}

      {day ? (
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

      <View key="1" style={{}}>
        <IconButton
          icon="arrow_left"
          color="gray"
          onClick={() => goPrevious()}
        />
        {day ? <span style={{}}>{printGameDay(day)}</span> : null}
        <IconButton icon="arrow_right" color="gray" onClick={() => goNext()} />
      </View>
      {loading ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : (
        <>
          <div style={{}}>
            <div onClick={() => setOpenCloseModalVisible(true)}>
              {day ? <OpenAndCloseRoom day={day} /> : null}
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
              <IconButton
                icon="add"
                color={'white'}
                onClick={() => setEventFormModalVisible(true)}
              />
              <IconButton
                icon="pin"
                iconSize={50}
                color={'white'}
                onClick={() => setCountingFormModalVisible(true)}
              />
            </View>
            <View>
              <View style={{}}>
                <Icon icon="home" iconSize={20} color={Colors.gray} />
                <span style={{}}>Occupation des salles</span>
              </View>
              {day ? <RoomPriorities day={day} /> : null}
              <View style={{}}>
                <Icon
                  icon="table_restaurant"
                  iconSize={20}
                  color={Colors.gray}
                />
                <span style={{}}>Nombre de tables utilisées</span>
              </View>
              {realRooms.map((r) => (
                <Card key={r.id}>
                  <View style={{}}>
                    <Icon icon="location_on" iconSize={20} />
                    <span>{r.name}</span>
                  </View>

                  {day && <OccupationStats room={r} events={events} />}
                </Card>
              ))}
            </View>
          </div>
        </>
      )}
    </View>
  );
}
