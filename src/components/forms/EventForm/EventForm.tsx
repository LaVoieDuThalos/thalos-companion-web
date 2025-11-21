import { Alert, Form } from 'react-bootstrap';
import { ACTIVITIES, EVENEMENT, JDR } from '../../../constants/Activities';
import { Durations } from '../../../constants/Durations';
import { ROOMS, SALLE_DU_LAC, TOUTE_LA_SALLE } from '../../../constants/Rooms';
import { calendarService } from '../../../services/CalendarService';
import { hasError, type CustomFormProps } from '../../../utils/FormUtils';
import { fromGameDayId, fromRoomId, printGameDay } from '../../../utils/Utils';
import {
  HYPHEN_EMPTY_OPTION,
  type FormData,
} from '../../modals/EventFormModal';

import { useUser } from '../../../hooks/useUser';
import type { Room } from '../../../model/Room';
import type { TablesAvailables } from '../../../services/BookingService';
import { roomService } from '../../../services/RoomService';
import { settingsService } from '../../../services/SettingsService';
import FormError from '../../common/FormError/FormError';
import Icon from '../../common/Icon';
import RichEditor from '../../common/RichEditor/RichEditor';
import RoomPriorities from '../../RoomPriorities/RoomPriorities';
import './EventForm.scss';

type Event = { target: { value: string } };

function buildTables(room: Room | null, availableTables: number): number[] {
  if (room == null) {
    return [];
  }

  const res = [];
  const fullOpen = availableTables === room.capacity;

  for (let i = 1; i < availableTables; i++) {
    res.push(i);
  }
  if (fullOpen) {
    res.push(TOUTE_LA_SALLE);
  } else if (availableTables > 0) {
    res.push(availableTables);
  }

  return res;
}

type Props = CustomFormProps<FormData> & {
  availableTables: TablesAvailables;
};

export default function EventForm({
  disabled,
  state,
  onChange,
  errors,
  formData,
  availableTables,
}: Props) {
  const days = calendarService.buildDaysFromDate(new Date(), 60);
  const hours = calendarService.hours();
  const durations = Durations;
  const { user } = useUser();

  const integerFields = ['durationInMinutes', 'tables'];

  const updateForm = (field: string, event: Event) => {
    if (field === 'roomId') {
      // reset tables selection when room changes
      formData.tables = 0;
    }

    const newFormData = {
      ...formData,
      [field]:
        integerFields.indexOf(field) >= 0
          ? parseInt(event.target.value)
          : event.target.value,
    };
    onChange(newFormData);
  };

  return (
    <Form>
      {/* Nom ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.NameInput">
        <Form.Label>Nom</Form.Label>
        <Form.Control
          type="title"
          placeholder=""
          className="title"
          disabled={disabled}
          autoFocus
          value={formData.title}
          onChange={(e) => updateForm('title', e)}
        />
        {state?.submitted && hasError(errors, 'nameIsEmpty') ? (
          <FormError error="Le nom est obligatoire" />
        ) : null}
        {state?.submitted &&
        (hasError(errors, 'nameIsLower') ||
          hasError(errors, 'nameIsHigher')) ? (
          <FormError
            error={`Le nom doit être entre 3 et 40 caractères (saisie ${formData.title?.length} car.)`}
          />
        ) : null}
        {state?.submitted && hasError(errors, 'nameIsInvalid') ? (
          <FormError error="Le nom doit être alphanumérique (caractères spéciaux autorisés : # @*)" />
        ) : null}
      </Form.Group>

      {/* Date ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.DateInput">
        <Form.Label>Date</Form.Label>

        <Form.Select
          size="lg"
          disabled={disabled}
          value={formData.dayId}
          onChange={(e) => updateForm('dayId', e)}
        >
          <option>-</option>
          {days.map((day) => (
            <option key={day.id} value={day.id}>
              {printGameDay(day)}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'dateIsEmpty') ? (
          <FormError error="La date est obligatoire" />
        ) : null}
      </Form.Group>

      {/* Début à ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.HourInput">
        <Form.Label>Début à</Form.Label>
        <Form.Select
          size="lg"
          disabled={disabled}
          value={formData.start}
          onChange={(e) => updateForm('start', e)}
        >
          <option>-</option>
          {hours.map((hh) => (
            <option key={hh} value={hh}>
              {hh}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'startHourIsEmpty') ? (
          <FormError error="L&lsquo;heure de début est obligatoire" />
        ) : null}
      </Form.Group>

      {/* Durée ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.DurationInput">
        <Form.Label>Durée</Form.Label>
        <Form.Select
          size="lg"
          disabled={disabled}
          value={formData.durationInMinutes}
          onChange={(e) => updateForm('durationInMinutes', e)}
        >
          <option>-</option>
          {durations.map((d) => (
            <option key={d.valueInMinutes} value={d.valueInMinutes}>
              {d.label}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'durationIsEmpty') ? (
          <FormError error="Le durée est obligatoire" />
        ) : null}
      </Form.Group>

      {/* Activité principale ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.ActivityInput">
        <Form.Label>Activité principale</Form.Label>
        <Form.Select
          size="lg"
          disabled={disabled}
          value={formData.activityId}
          onChange={(e) => updateForm('activityId', e)}
        >
          <option>-</option>
          {ACTIVITIES.filter((act) =>
            settingsService.activityVisible(user.preferences || {}, act.id)
          ).map((act) => (
            <option key={act.id} value={act.id}>
              {act.name}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'activityIsEmpty') ? (
          <FormError error="L&lsquo;activité principale est obligatoire" />
        ) : null}
      </Form.Group>

      {/* Game Master ------------------------------------------------------------- */}
      {formData.activityId === JDR.id && (
        <Form.Group className="mb-3" controlId="eventForm.GameMasterInput">
          <Form.Label>Maître du Jeu (MJ)</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            className="game-master"
            disabled={disabled}
            autoFocus
            value={formData.gameMaster}
            onChange={(e) => updateForm('gameMaster', e)}
          />
          {state?.submitted && hasError(errors, 'gameMasterIsEmpty') ? (
            <FormError error="Le nom du M.J. est obligatoire pour le JDR" />
          ) : null}
          {state?.submitted &&
          (hasError(errors, 'gameMasterIsLower') ||
            hasError(errors, 'gameMasterIsHigher')) ? (
            <FormError
              error={`Le nom doit être entre 3 et 40 caractères (saisie ${formData.gameMaster?.length} car.)`}
            />
          ) : null}
          {state?.submitted && hasError(errors, 'gameMasterIsInvalid') ? (
            <FormError error="Le nom doit être alphanumérique (caractères spéciaux autorisés : # @*)" />
          ) : null}
        </Form.Group>
      )}

      {/* Salle ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.RoomInput">
        <Form.Label>Salle</Form.Label>
        <Form.Select
          size="lg"
          disabled={
            disabled ||
            formData.dayId === HYPHEN_EMPTY_OPTION ||
            formData.start === HYPHEN_EMPTY_OPTION
          }
          value={formData.roomId}
          onChange={(e) => updateForm('roomId', e)}
        >
          <option>-</option>
          {ROOMS.filter(
            (room) =>
              (room.id !== SALLE_DU_LAC.id ||
                formData.activityId === EVENEMENT.id) &&
              !room.virtual
          ).map((r) => {
            const tables = availableTables[r.id];
            return (
              <option
                key={r.id}
                value={r.id}
                disabled={tables === 0 && !r.virtual}
                data-room-occupied={tables === 0}
              >
                {r.name} - (
                {tables === undefined || tables === TOUTE_LA_SALLE
                  ? 'Disponible'
                  : tables === 0
                    ? 'Complet'
                    : tables === r.capacity
                      ? 'Disponible'
                      : `Reste ${tables} / ${r.capacity} tables`}
                )
              </option>
            );
          })}
        </Form.Select>
        {formData.roomId !== HYPHEN_EMPTY_OPTION &&
        !roomService.isActivityAllowedInRoom(
          formData.activityId,
          formData.dayId,
          formData.roomId
        ) ? (
          <Alert variant="warning">
            <Icon icon="warning" iconSize={20} /> Attention, cette activité
            n'est pas prioritaire dans cette salle cette semaine :{' '}
            <RoomPriorities day={fromGameDayId(formData.dayId)!} />
          </Alert>
        ) : null}
        {state?.submitted && hasError(errors, 'roomIsEmpty') ? (
          <FormError error="La salle est obligatoire" />
        ) : null}
        {state?.submitted && hasError(errors, 'roomIsOccupied') ? (
          <FormError error="La salle n'est pas disponible pour ce créneau" />
        ) : null}
        {state?.submitted && hasError(errors, 'nonPriorityActivity') ? (
          <FormError error="L'activité choisie n'est pas prioritaire dans cette salle." />
        ) : null}
      </Form.Group>

      {/* Tables ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.TableNumberInput">
        <Form.Label>Tables</Form.Label>
        <Form.Select
          size="lg"
          disabled={disabled}
          value={formData.tables}
          onChange={(e) => updateForm('tables', e)}
        >
          <option>-</option>
          {buildTables(
            fromRoomId(formData.roomId),
            availableTables[formData.roomId]
          ).map((t) => (
            <option
              key={t}
              value={t}
              disabled={
                !!formData.roomId &&
                t > availableTables[formData.roomId] &&
                t != TOUTE_LA_SALLE
              }
            >
              {t === TOUTE_LA_SALLE
                ? 'Toute la salle'
                : t === 1
                  ? `1 table`
                  : `${t} tables`}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'tablesIsEmpty') ? (
          <FormError error="Le nombre de tables est obligatoire" />
        ) : null}
      </Form.Group>

      {/* Description ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.DescriptionInput">
        <Form.Label>Description</Form.Label>
        <RichEditor
          value={formData.description}
          onChange={(e) => updateForm('description', e)}
        />
      </Form.Group>
    </Form>
  );
}
