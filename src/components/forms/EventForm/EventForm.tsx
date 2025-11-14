import { Form } from 'react-bootstrap';
import { ACTIVITIES } from '../../../constants/Activities';
import { Durations } from '../../../constants/Durations';
import { ROOMS, TOUTE_LA_SALLE } from '../../../constants/Rooms';
import { calendarService } from '../../../services/CalendarService';
import { hasError, type CustomFormProps } from '../../../utils/FormUtils';
import {
  fromGameDayId,
  fromRoomId,
  getEndTime,
  getStartTime,
  printGameDay,
} from '../../../utils/Utils';
import {
  HYPHEN_EMPTY_OPTION,
  type FormData,
} from '../../modals/EventFormModal';

import { useCallback, useEffect, useState } from 'react';
import type { Room } from '../../../model/Room';
import {
  bookingService,
  type TablesAvailables,
} from '../../../services/BookingService';
import FormError from '../../common/FormError/FormError';
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
  }

  return res;
}

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

  const updateAvailablesTablesByRooms = useCallback(
    (_formData: FormData, ignoreChangeEvent = false) => {
      const gameDay = fromGameDayId(_formData.dayId);
      const startTime = gameDay ? getStartTime(gameDay, _formData.start) : 0;
      const endTime = gameDay
        ? getEndTime(gameDay, _formData.start, _formData.durationInMinutes - 1)
        : 0;

      bookingService
        .availablesTablesByRooms(
          _formData.dayId,
          startTime,
          endTime,
          _formData.id ? [_formData.id] : []
        )
        .then((availablesTablesByRooms) => {
          setAvailablesTables(availablesTablesByRooms);
          if (
            _formData.roomId !== undefined &&
            availablesTablesByRooms[_formData.roomId] > 0 &&
            _formData.tables !== TOUTE_LA_SALLE &&
            _formData.tables > availablesTablesByRooms[_formData.roomId]
          ) {
            formData.tables = availablesTablesByRooms[_formData.roomId];
          }
          if (!ignoreChangeEvent) {
            onChange({
              ..._formData,
              roomIsAvailable:
                formData.roomId !== undefined &&
                availablesTablesByRooms[formData.roomId] > 0,
            });
          }
        });
    },
    []
  );

  const integerFields = ['durationInMinutes', 'tables'];

  const updateForm = (field: string, event: Event) => {
    if (field === 'roomId') {
      // reset tables selection when room changes
      formData.tables = TOUTE_LA_SALLE;
    }

    const newFormData = {
      ...formData,
      [field]:
        integerFields.indexOf(field) >= 0
          ? parseInt(event.target.value)
          : event.target.value,
    };
    if (
      ['dayId', 'start', 'durationInMinutes', 'roomId'].indexOf(field) >= 0 &&
      newFormData.dayId &&
      newFormData.start &&
      newFormData.durationInMinutes
    ) {
      updateAvailablesTablesByRooms(newFormData);
    } else {
      onChange(newFormData);
    }
  };

  useEffect(() => {
    updateAvailablesTablesByRooms(formData, true);
  }, []);

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
          {ACTIVITIES.map((act) => (
            <option key={act.id} value={act.id}>
              {act.name}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'activityIsEmpty') ? (
          <FormError error="L&lsquo;activité principale est obligatoire" />
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
            availablesTables[formData.roomId]
          ).map((t) => (
            <option
              key={t}
              value={t}
              disabled={
                !!formData.roomId &&
                t > availablesTables[formData.roomId] &&
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
