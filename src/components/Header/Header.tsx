import { useContext, useEffect, useState } from 'react';
import { Image, Navbar } from 'react-bootstrap';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { Colors } from '../../constants/Colors';
import { Globals } from '../../constants/Globals';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { User } from '../../model/User';
import IconButton from '../common/IconButton/IconButton';
import Row from '../common/Row';
import EventFormModal from '../modals/EventFormModal';
import SettingsFormModal from '../modals/SettingsFormModal';
import './Header.scss';
import { ROLE_BUREAU } from '../../constants/Roles';
import CountingFormModal from '../modals/CountingFormModal/CountingFormModal';
import { printGameDay } from '../../utils/Utils';
import { calendarService } from '../../services/CalendarService';

export default function Header() {
  const appContext = useContext(AppContext);
  const { user, setUser, hasRole } = useUser();
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [countingFormModalVisible, setCountingFormModalVisible] =
    useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.name) {
      setSettingsModalVisible(true);
    }
  }, []);

  const today = calendarService.now();

  return (
    <>
      <Navbar expand="lg" className="justify-content-between">
        <Navbar.Brand href={Globals.BASE_URL + '/'} style={{}}>
          <Image src={Globals.BASE_URL + '/icon100.png'} width={'50vw'}/>
          <span className="app-title">La Voie du Thalos</span>
        </Navbar.Brand>

        <Row style={{}}>

          {hasRole(ROLE_BUREAU) && calendarService.isGameDay(today.date) && (
            <IconButton
              icon="123"
              label=""
              color={Colors.red2}
              variant="light"
              iconSize={30}
            fontSize={10}
            onClick={() => setCountingFormModalVisible(true)}
          ></IconButton>) }

          <IconButton
            icon="add"
            label=""
            color={Colors.red2}
            variant="light"
            iconSize={30}
            fontSize={10}
            onClick={() => setEventFormModalVisible(true)}
          ></IconButton>

          <IconButton
            icon="settings"
            color={Colors.white}
            iconSize={30}
            onClick={() => setSettingsModalVisible(true)}
          />
        </Row>

      </Navbar>
      
        {eventFormModalVisible ? (
          <EventFormModal
            show={true}
            onCancel={() => setEventFormModalVisible(false)}
            onSuccess={(event) => {
              setEventFormModalVisible(false);
              appContext.refresh(`home.events`);
              appContext.refresh(`agenda.${event?.day.id}`);

              if (matchPath({ path: '/events/:eventId' }, location.pathname)) {
                navigate(`/events/${event.id}`);
              }
            }}
          />
        ) : null}

        {settingsModalVisible ? (
          <SettingsFormModal
            show={true}
            welcomeMode={!user || !user.name}
            onHide={() => setSettingsModalVisible(false)}
            onCancel={() => setSettingsModalVisible(false)}
            onSuccess={(newUser: User) => {
              setUser(newUser);
              setSettingsModalVisible(false);
              appContext.refresh(`home.events`);
              appContext.refresh(`agenda`);
            }}
          />
        ) : null}

        {hasRole(ROLE_BUREAU) && calendarService.isGameDay(today.date) ? (
        <CountingFormModal
          dayId={today.id}
          title={`Comptage : ${printGameDay(today)}`}
          show={countingFormModalVisible}
          onCancel={() => setCountingFormModalVisible(false)}
          onSuccess={() => {
            setCountingFormModalVisible(false);            
          }}
        />
      ) : null}
    </>
  );
}
