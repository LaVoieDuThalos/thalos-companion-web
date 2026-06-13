import { useContext, useEffect, useState } from 'react';
import { Button, Image, Navbar, Offcanvas } from 'react-bootstrap';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { Colors } from '../../constants/Colors';
import { Globals } from '../../constants/Globals';
import { ROLE_BUREAU, ROLE_OUVREUR } from '../../constants/Roles';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { User } from '../../model/User';
import { calendarService } from '../../services/CalendarService';
import { printGameDay } from '../../utils/Utils';
import Icon from '../common/Icon';
import IconButton from '../common/IconButton/IconButton';
import CountingFormModal from '../modals/CountingFormModal/CountingFormModal';
import EventFormModal from '../modals/EventFormModal';
import SettingsFormModal from '../modals/SettingsFormModal';
import './Header.scss';

export default function Header() {
  const appContext = useContext(AppContext);
  const { user, setUser, hasRole } = useUser();
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [countingFormModalVisible, setCountingFormModalVisible] =
    useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <Button
              color={Colors.red2}
              variant="primary"
              size="lg"
              onClick={() => setEventFormModalVisible(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Icon icon="add" iconSize={30} />
              Créer un événement
            </Button>

            <Button
              color={Colors.white}
              variant="secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              onClick={() => setSettingsModalVisible(true)}
            >
              <Icon icon="settings" iconSize={30} />
              Préférences
            </Button>

            {(hasRole(ROLE_BUREAU) || hasRole(ROLE_OUVREUR)) &&
              calendarService.isGameDay(today.date) && (
                <Button
                  color={Colors.red2}
                  variant="secondary"
                  onClick={() => setCountingFormModalVisible(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <Icon icon="123" iconSize={30} />
                  Saisir le comptage : {printGameDay(today)}
                </Button>
              )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Navbar expand="lg" className="justify-content-between">
        <Navbar.Brand href={Globals.BASE_URL + '/'} style={{}}>
          <Image src={Globals.BASE_URL + '/icon100.png'} width={'50vw'} />
          <span className="app-title">La Voie du Thalos</span>
        </Navbar.Brand>

        <IconButton
          icon="menu"
          label=""
          color={Colors.red2}
          variant="light"
          iconSize={30}
          fontSize={10}
          onClick={() => handleShow()}
        ></IconButton>
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
