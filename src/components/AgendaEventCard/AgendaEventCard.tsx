import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Colors } from '../../constants/Colors';
import { durationToString } from '../../constants/Durations';
import { AUTRE_SALLE, TOUTE_LA_SALLE } from '../../constants/Rooms';
import { AlertActions, AlertContext } from '../../contexts/AlertsContext';
import type { AgendaEvent, EventSubscription } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';
import { printGameDay } from '../../utils/Utils';
import CustomCard from '../common/CustomCard/CustomCard';
import IconButton from '../common/IconButton/IconButton';
import Label from '../common/Label';
import Row from '../common/Row';
import Tag from '../common/Tag/Tag';
import View from '../common/View';

import { Image } from 'react-bootstrap';
import { Globals } from '../../constants/Globals';
import { findRoleById, ROLE_BUREAU } from '../../constants/Roles.ts';
import { useUser } from '../../hooks/useUser.ts';
import RichEditor from '../common/RichEditor/RichEditor';
import type { StyleSheet } from '../common/Types';
import './AgendaEventCard.scss';
import EventSubscriptions from './components/EventSubscriptions/EventSubscriptions.tsx';
import { subscriptionService } from '../../services/SubscriptionService.ts';
import AvailableSeats from './components/AvailableSeats/AvailableSeats.tsx';

export type Options = {
  hideDate?: boolean;
};

type Props = {
  event: AgendaEvent;
  complete?: boolean;
  showButtons?: boolean;
  options?: Options;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  even?: boolean;
};

export default function AgendaEventCard({
  event,
  complete,
  showButtons,
  options,
  even,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const { user, hasRole } = useUser();

  const duration = event.durationInMinutes
    ? durationToString(event.durationInMinutes)
    : null;

  const Alerts = useContext(AlertContext);

  const canEdit = () => {
    // Creator or Référent or Bureau
    const role = findRoleById('referent.' + event.activity?.id);
    const hasRoleReferent = role !== undefined && hasRole(role);
    return (
      (!!user && event.creator?.id === user.id) ||
      hasRole(ROLE_BUREAU) ||
      hasRoleReferent
    );
  };

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

  const [subscriptions, setSubscriptions] = useState<EventSubscription[]>([]);
  useEffect(() => {
    if (event.withSubscriptions) {
      subscriptionService
        .findAllSubscriptionsOfEvent(event)
        .then((subs) => setSubscriptions(subs));
    }
  }, []);

  const roomName =
    event.room !== undefined && event.roomId !== AUTRE_SALLE.id
      ? event.room.name
      : event.otherRoomName +
        (event.otherRoomAddress ? ' - ' + event.otherRoomAddress : '');

  return (
    <CustomCard
      className="agenda-event-card"
      even={even}
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

      {event.withSubscriptions ? (
        <AvailableSeats event={event} subscriptions={subscriptions} />
      ) : null}

      {/* Creator */}
      {complete ? (
        <View>
          {event.creator ? (
            <div className="creator">
              <span>Crée par</span>
              <span className="creator-name">{event.creator.name}</span>
            </div>
          ) : null}
          {event.lastModification &&
          event.creator?.id !== event.lastModification.user.id ? (
            <div className="last-modification">
              <span>Dernière modification par</span>
              <span className="last-modifier-name">
                {event.lastModification.user.name}
              </span>
            </div>
          ) : null}
        </View>
      ) : null}

      {/* Illustration / Affiche */}
      {complete && event.img ? (
        <div className="event-img">
          <Image src={event.img} fluid rounded />
        </div>
      ) : null}

      {/* Description */}
      {complete && event.description ? (
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
            {event.roomId === AUTRE_SALLE.id && event.otherRoomMapUrl !== '' ? (
              <a href={event.otherRoomMapUrl} target="_blank">
                {roomName}
              </a>
            ) : (
              <span>{roomName}</span>
            )}
          </Label>

          {event.tables !== undefined && event.tables > 0 ? (
            <Label icon="table_restaurant" color="gray" size={20}>
              <span>
                x{' '}
                {event.tables !== TOUTE_LA_SALLE
                  ? `${event.tables}`
                  : 'Toute la salle'}
              </span>
            </Label>
          ) : null}
        </Row>
      ) : null}

      {complete && event.withSubscriptions && (
        <EventSubscriptions event={event} />
      )}

      {showButtons ? (
        <>
          <hr />
          <div className="buttons">
            {event.discordChannel && (
              <a href={event.discordChannel} target="_blank">
                <Image
                  src={Globals.BASE_URL + '/icons/discord.png'}
                  width={50}
                  height={50}
                />
              </a>
            )}
            <IconButton
              icon="edit"
              color={Colors.white}
              variant="secondary"
              disabled={!canEdit()}
              label="MODIFIER"
              iconSize={32}
              onClick={() => (onEdit ? onEdit() : null)}
            />
            <IconButton
              icon="delete"
              variant="danger"
              color={Colors.white}
              disabled={!canEdit()}
              label="SUPPRIMER"
              iconSize={32}
              onClick={() => confirmDeleteEvent()}
            />
          </div>
        </>
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
