import { Colors } from '../../../../constants/Colors.ts';
import { Button, Offcanvas } from 'react-bootstrap';
import Icon from '../../../common/Icon.tsx';
import { useUser } from '../../../../hooks/useUser.ts';
import { ROLE_BUREAU, ROLE_OUVREUR } from '../../../../constants/Roles.ts';
import { calendarService } from '../../../../services/CalendarService.ts';
import { printGameDay } from '../../../../utils/Utils.ts';
import './SideMainMenu.scss';
import type { CSSProperties } from 'react';
import { settingsService } from '../../../../services/SettingsService.ts';

type Props = {
  show?: boolean;
  onHide?: () => void;
  onClickItem: (item: string) => void;
};

const MenuItemStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

export default function SideMainMenu({ show, onHide, onClickItem }: Props) {
  const { user, hasRole } = useUser();
  const today = calendarService.now();

  const isOuvreur =
    user &&
    user.preferences &&
    settingsService.hasRole(user.preferences, ROLE_OUVREUR);

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Bonjour {user?.name || ''},</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            variant="secondary"
            style={MenuItemStyles}
            onClick={() => onClickItem('home')}
          >
            <Icon icon="home" iconSize={30} />
            Accueil
          </Button>
        </div>
        <hr />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            color={Colors.red2}
            variant="primary"
            size="lg"
            onClick={() => {
              //setEventFormModalVisible(true);
              onClickItem('new-event');
            }}
            style={MenuItemStyles}
          >
            <Icon icon="add" iconSize={30} />
            Créer un événement
          </Button>

          <Button
            variant="secondary"
            style={MenuItemStyles}
            onClick={() => onClickItem('agenda')}
          >
            <Icon icon="calendar_month" iconSize={30} />
            Agenda
          </Button>

          {(hasRole(ROLE_BUREAU) || hasRole(ROLE_OUVREUR)) &&
            calendarService.isGameDay(today.date) && (
              <Button
                color={Colors.red2}
                variant="secondary"
                onClick={() => {
                  //setCountingFormModalVisible(true);
                  onClickItem('counting');
                }}
                style={MenuItemStyles}
              >
                <Icon icon="123" iconSize={30} />
                Saisir le comptage :<br /> {printGameDay(today)}
              </Button>
            )}
        </div>
        <hr />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isOuvreur && (
            <Button
              variant="secondary"
              style={MenuItemStyles}
              onClick={() => onClickItem('keys')}
            >
              <Icon icon="key" iconSize={30} />
              Badges
            </Button>
          )}

          <hr />
          <Button
            color={Colors.white}
            variant="secondary"
            style={MenuItemStyles}
            onClick={() => {
              //setSettingsModalVisible(true);
              onClickItem('settings');
            }}
          >
            <Icon icon="settings" iconSize={30} />
            Préférences
          </Button>
          <Button
            variant="secondary"
            style={MenuItemStyles}
            onClick={() => onClickItem('info')}
          >
            <Icon icon="info" iconSize={30} />
            Informations
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
