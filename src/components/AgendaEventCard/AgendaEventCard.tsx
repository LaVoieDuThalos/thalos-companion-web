import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { Colors } from '../../constants/Colors';
import { durationToString } from '../../constants/Durations';
import { TOUTE_LA_SALLE } from '../../constants/Rooms';
import { AlertActions, AlertContext } from '../../contexts/AlertsContext';
import type { AgendaEvent } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';
import { printGameDay } from '../../utils/Utils';
import CustomCard from '../common/CustomCard/CustomCard';
import IconButton from '../common/IconButton/IconButton';
import Label from '../common/Label';
import Row from '../common/Row';
import Tag from '../common/Tag/Tag';
import View from '../common/View';

import RichEditor from '../common/RichEditor/RichEditor';
import type { StyleSheet } from '../common/Types';
import './AgendaEventCard.scss';

export type Options = {
  hideDate?: boolean;
};

type Props = {
  event: Partial<AgendaEvent>;
  complete?: boolean;
  showButtons?: boolean;
  options?: Options;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function AgendaEventCard({
  event,
  complete,
  showButtons,
  options,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  const duration = event.durationInMinutes
    ? durationToString(event.durationInMinutes)
    : null;

  const Alerts = useContext(AlertContext);

  const confirmDeleteEvent = () => {
    Alerts.dialog(
      'Supprimer un évènement',
      `Supprimer l'évènement ${event.title} ?`,
      [
        AlertActions.CANCEL(),
        AlertActions.OK(
          () =>
            agendaService.deleteEvent(event.id!).then(() => {
              if (onDelete) {
                onDelete();
              }
            }),
          'Supprimer'
        ),
      ]
    );
  };

  return (
    <CustomCard
      className="agenda-event-card"
      onClick={() => {
        if (!complete) {
          navigate(`/events/${event.id}`);
        }
      }}
      clickable={!complete}
      style={{ borderLeftColor: event.activity?.style.backgroundColor }}
    >
      {event.activity ? (
        <Row>
          <Tag
            color={event.activity.style.backgroundColor}
            textColor={event.activity.style.color}
          >
            <span style={styles.activityName}>{event.activity.name}</span>
          </Tag>
        </Row>
      ) : null}

      {/* Date  */}
      {event.day && !options?.hideDate ? (
        <div className="card-item">
          <Link
            to={'/agenda/' + event.day.id}
            className="test-date"
            style={styles.eventDateText}
          >
            {printGameDay(event.day)}
          </Link>
        </div>
      ) : null}

      {/* Nom */}
      <div className="title">
        <span>{event.title}</span>
      </div>

      {event.gameMaster && (
        <div className="game-master">
          Masterisé par <strong>{event.gameMaster}</strong>
        </div>
      )}

      {/* Heure de début-fin */}
      {event.start ? (
        <Row style={{ justifyContent: 'center' }}>
          <Label icon="schedule" color="gray" size={20}>
            <span>{event.start}</span>
            {duration ? <span> ({`${duration.label}`})</span> : null}
          </Label>
        </Row>
      ) : (
        <span>?</span>
      )}

      {/* Creator */}
      {complete ? (
        <View>
          {event.creator ? (
            <div className="creator">
              <span>Crée par</span>
              <span className="creator-name">{event.creator.name}</span>
            </div>
          ) : null}
          {event.lastModification ? (
            <div className="last-modification">
              <span>Dernière modification par</span>
              <span className="last-modifier-name">
                {event.lastModification.user.name}
              </span>
            </div>
          ) : null}
        </View>
      ) : null}

      {/* Description */}
      {complete ? (
        <div className="description">
          {event.description ? (
            <RichEditor
              value={event.description}
              readOnly
              onChange={() => {}}
            />
          ) : (
            <p>Pas de description</p>
          )}
        </div>
      ) : null}

      {/* Salle */}
      {event.room ? (
        <Row style={styles.location}>
          <Label icon="location_on" color="gray" size={20}>
            <span>{event.room.name}</span>
          </Label>
          <Label icon="table_restaurant" color="gray" size={20}>
            <span>
              x{' '}
              {event.tables !== TOUTE_LA_SALLE
                ? `${event.tables}`
                : 'Toute la salle'}
            </span>
          </Label>
        </Row>
      ) : null}

      {showButtons ? (
        <div className="buttons">
          <IconButton
            icon="edit"
            color={Colors.white}
            variant="secondary"
            iconSize={32}
            onClick={() => (onEdit ? onEdit() : null)}
          />
          <IconButton
            icon="delete"
            variant="danger"
            color={Colors.white}
            iconSize={32}
            onClick={() => confirmDeleteEvent()}
          />
        </div>
      ) : null}
    </CustomCard>
  );
}

const styles: StyleSheet = {
  location: {
    justifyContent: 'flex-end',
    gap: 20,
  },
};
