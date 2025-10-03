import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Colors } from '../constants/Colors';
import { durationToString } from '../constants/Durations';
import { TOUTE_LA_SALLE } from '../constants/Rooms';
import { AlertActions, AlertContext } from '../contexts/AlertsContext';
import type { AgendaEvent } from '../model/AgendaEvent';
import { agendaService } from '../services/AgendaService';
import { printGameDay } from '../utils/Utils';
import CustomCard from './common/CustomCard';
import IconButton from './common/IconButton/IconButton';
import Label from './common/Label';
import Row from './common/Row';
import Tag from './common/Tag';
import View from './common/View';
type Props = {
  event: Partial<AgendaEvent>;
  complete?: boolean;
  showButtons?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function AgendaEventCard({
  event,
  complete,
  showButtons,
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
      className="AgendaEventCard"
      onClick={() => navigate(`/events/${event.id}`)}
      style={{}}
    >
      {event.activity ? (
        <Row>
          <Tag
            color={event.activity.style.backgroundColor}
            textColor={event.activity.style.color}
          >
            <span style={{}}>{event.activity.name}</span>
          </Tag>
        </Row>
      ) : null}

      {/* Date  */}
      {event.day ? (
        <View style={{}}>
          <span style={{}}>{printGameDay(event.day)}</span>
        </View>
      ) : (
        <span>?</span>
      )}
      {/* Heure de début-fin */}
      {event.start ? (
        <Row style={{}}>
          <Label icon="schedule" color="gray" size={20}>
            <span style={{}}>{event.start}</span>
            {duration ? <span style={{}}> ({`${duration.label}`})</span> : null}
          </Label>
        </Row>
      ) : (
        <span>?</span>
      )}

      {/* Nom */}
      <View style={{}}>
        <span>{event.title}</span>
      </View>

      {/* Creator */}
      {complete ? (
        <View style={{}}>
          {event.creator ? (
            <View style={{}}>
              <span>Crée par</span>
              <span style={{}}>{event.creator.name}</span>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Description */}
      {complete ? (
        <View style={{}}>
          {event.description ? (
            <span>{event.description}</span>
          ) : (
            <span>Pas de description</span>
          )}
        </View>
      ) : null}

      {/* Salle */}
      {event.room ? (
        <Row style={{}}>
          <Label icon="location_on" color="gray" size={20}>
            <span>{event.room.name}</span>
          </Label>
          <Label icon="table_restaurant" color="gray" size={20}>
            <span>
              :{' '}
              {event.tables !== TOUTE_LA_SALLE
                ? `${event.tables}`
                : 'Toute la salle'}
            </span>
          </Label>
        </Row>
      ) : null}

      {showButtons ? (
        <View style={{}}>
          <IconButton
            icon="edit"
            color={Colors.white}
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
        </View>
      ) : null}
    </CustomCard>
  );
}
