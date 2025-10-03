import { useContext, useState } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Colors } from '../constants/Colors';
import { AppContext } from '../contexts/AppContext';
import Icon from './common/Icon';
import IconButton from './common/IconButton/IconButton';
import Row from './common/Row';
import EventFormModal from './modals/EventFormModal';
import SettingsFormModal from './modals/SettingsFormModal';

export default function Header() {
  const appContext = useContext(AppContext);
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  return (
    <Navbar style={{}} className="justify-content-between">
      <Navbar.Brand href="/" style={{}}>
        <img
          alt="Logo"
          src={'/thalos-companion-web/icon100.png'}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        La Voie du Thalos
      </Navbar.Brand>

      <Row style={{}}>
        <Button style={{}} onClick={() => setEventFormModalVisible(true)}>
          <Icon icon="add" iconSize={20} />
          Créer...
        </Button>

        <IconButton
          icon="settings"
          color={Colors.white}
          iconSize={40}
          onClick={() => setSettingsModalVisible(true)}
        />
      </Row>

      <EventFormModal
        show={eventFormModalVisible}
        onCancel={() => setEventFormModalVisible(false)}
        onSuccess={(event) => {
          appContext.refresh(`home.events`);
          appContext.refresh(`agenda.${event?.day.id}`);
          setEventFormModalVisible(false);
        }}
      />

      <SettingsFormModal
        show={settingsModalVisible}
        onHide={() => setSettingsModalVisible(false)}
        onCancel={() => setSettingsModalVisible(false)}
        onSuccess={() => {
          appContext.refresh(`home.events`);
          appContext.refresh(`agenda`);
          setSettingsModalVisible(false);
        }}
      />
    </Navbar>
  );
}
