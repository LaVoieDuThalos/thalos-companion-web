import { useContext, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { User } from '../../model/User';
import IconButton from '../common/IconButton/IconButton';
import Row from '../common/Row';
import EventFormModal from '../modals/EventFormModal';
import SettingsFormModal from '../modals/SettingsFormModal';
import './Header.scss';

export default function Header() {
  const appContext = useContext(AppContext);
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [user, setUser] = useUser();

  return (
    <>
      <Navbar expand="lg" className="justify-content-between">
        <Navbar.Brand href="/" style={{}}>
          <img
            alt="Logo"
            src={'/thalos-companion-web/icon100.png'}
            width="40"
            height="40"
            className="d-inline-block align-top"
          />{' '}
          La Voie du Thalos
        </Navbar.Brand>

        <Row style={{}}>
          <IconButton
            icon="add"
            label="Créer"
            onClick={() => setEventFormModalVisible(true)}
          ></IconButton>

          <IconButton
            icon="settings"
            color={Colors.white}
            iconSize={40}
            onClick={() => setSettingsModalVisible(true)}
          />
        </Row>

        {eventFormModalVisible ? (
          <EventFormModal
            show={true}
            onCancel={() => setEventFormModalVisible(false)}
            onSuccess={(event) => {
              setEventFormModalVisible(false);
              appContext.refresh(`home.events`);
              appContext.refresh(`agenda.${event?.day.id}`);
            }}
          />
        ) : null}

        {settingsModalVisible ? (
          <SettingsFormModal
            show={true}
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
      </Navbar>
      <div>{JSON.stringify(user)}</div>
    </>
  );
}
