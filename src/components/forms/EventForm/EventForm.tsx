import { Form } from 'react-bootstrap';
import { ACTIVITIES } from '../../../constants/Activities';
import { Durations } from '../../../constants/Durations';
import { ROOMS, TABLES, TOUTE_LA_SALLE } from '../../../constants/Rooms';
import { calendarService } from '../../../services/CalendarService';
import { hasError, type CustomFormProps } from '../../../utils/FormUtils';
import {
  fromGameDayId,
  getEndTime,
  getStartTime,
  printGameDay,
} from '../../../utils/Utils';
import {
  HYPHEN_EMPTY_OPTION,
  type FormData,
} from '../../modals/EventFormModal';

import { useState } from 'react';
import {
  bookingService,
  type TablesAvailables,
} from '../../../services/BookingService';
import './EventForm.scss';

type Event = { target: { value: string } };

export default function EventForm({
  disabled,
  state,
  onChange,
  errors,
  formData,
}: CustomFormProps<FormData>) {
  const days = calendarService.buildDaysFromDate(new Date(), 60);
  const hours = calendarService.hours();
  const durations = Durations;

  const [availablesTables, setAvailablesTables] = useState<TablesAvailables>(
    {}
  );

  const updateForm = (field: string, event: Event) => {
    const newFormData = { ...formData, [field]: event.target.value };
    if (
      newFormData.dayId &&
      newFormData.start &&
      newFormData.durationInMinutes
    ) {
      const gameDay = fromGameDayId(newFormData.dayId);
      const startTime = gameDay ? getStartTime(gameDay, newFormData.start) : 0;
      const endTime = gameDay
        ? getEndTime(gameDay, newFormData.start, newFormData.durationInMinutes)
        : 0;
      console.log('Start', new Date(startTime), 'End', new Date(endTime));

      bookingService
        .availablesTablesByRooms(newFormData.dayId, startTime, endTime)
        .then((availablesTablesByRooms) => {
          console.log('Availables tables', availablesTables);
          setAvailablesTables(availablesTablesByRooms);
        });
    } else {
      setAvailablesTables({});
    }
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
          disabled={disabled}
          autoFocus
          value={formData.title}
          onChange={(e) => updateForm('title', e)}
        />
        {state?.submitted && hasError(errors, 'nameIsEmpty') ? (
          <p className="form-error">Le nom est obligatoire</p>
        ) : null}
        {state?.submitted &&
        (hasError(errors, 'nameIsLower') ||
          hasError(errors, 'nameIsHigher')) ? (
          <p className="form-error">
            Le nom doit être entre 3 et 40 caractères (saisie{' '}
            {formData.title?.length} car.)
          </p>
        ) : null}
        {state?.submitted && hasError(errors, 'nameIsInvalid') ? (
          <p className="form-error">
            Le nom doit être alphanumérique (caractères spéciaux autorisés : # @
            *)
          </p>
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
          <p className="form-error">La date est obligatoire</p>
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
          <p className="form-error">L&lsquo;heure de début est obligatoire</p>
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
          <p className="form-error">Le durée est obligatoire</p>
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
          {ACTIVITIES.map((act) => (
            <option key={act.id} value={act.id}>
              {act.name}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'activityIsEmpty') ? (
          <p className="form-error">
            L&lsquo;activité principale est obligatoire
          </p>
        ) : null}
      </Form.Group>

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
          {ROOMS.map((r) => {
            const tables = availablesTables[r.id];
            return (
              <option
                key={r.id}
                value={r.id}
                disabled={tables === 0 && !r.virtual}
              >
                {r.name} - (
                {tables === TOUTE_LA_SALLE
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
        {state?.submitted && hasError(errors, 'roomIsEmpty') ? (
          <p className="form-error">La salle est obligatoire</p>
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
          {TABLES.map((t) => (
            <option
              key={t}
              value={t}
              disabled={
                !!formData.roomId && t > availablesTables[formData.roomId]
              }
            >
              {t === TOUTE_LA_SALLE ? 'Toute la salle' : t + ' tables'}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'tablesIsEmpty') ? (
          <p className="form-error">Le nombre de tables est obligatoire</p>
        ) : null}
      </Form.Group>

      {/* Description ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.DescriptionInput">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          disabled={disabled}
          rows={8}
          value={formData.description}
          onChange={(e) => updateForm('description', e)}
        />
      </Form.Group>
    </Form>
  );
}
