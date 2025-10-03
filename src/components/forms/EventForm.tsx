import { Form } from 'react-bootstrap';
import { ACTIVITIES } from '../../constants/Activities';
import { Durations } from '../../constants/Durations';
import { ROOMS, TABLES, TOUTE_LA_SALLE } from '../../constants/Rooms';
import { calendarService } from '../../services/CalendarService';
import { hasError, type CustomFormProps } from '../../utils/FormUtils';
import { printGameDay } from '../../utils/Utils';
import type { FormData } from '../modals/EventFormModal';

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

  const updateForm = (field: string, event: Event) => {
    onChange({ ...formData, [field]: event.target.value });
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
          <span style={{}}>Le nom est obligatoire</span>
        ) : null}
        {state?.submitted &&
        (hasError(errors, 'nameIsLower') ||
          hasError(errors, 'nameIsHigher')) ? (
          <span style={{}}>
            Le nom doit être entre 3 et 40 caractères (saisie{' '}
            {formData.title?.length} car.)
          </span>
        ) : null}
        {state?.submitted && hasError(errors, 'nameIsInvalid') ? (
          <span style={{}}>
            Le nom doit être alphanumérique (caractères spéciaux autorisés : # @
            *)
          </span>
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
          <span style={{}}>La date est obligatoire</span>
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
          <span style={{}}>L&lsquo;heure de début est obligatoire</span>
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
          <span style={{}}>Le durée est obligatoire</span>
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
          <span style={{}}>L&lsquo;activité principale est obligatoire</span>
        ) : null}
      </Form.Group>

      {/* Salle ------------------------------------------------------------- */}
      <Form.Group className="mb-3" controlId="eventForm.RoomInput">
        <Form.Label>Salle</Form.Label>
        <Form.Select
          size="lg"
          disabled={disabled}
          value={formData.roomId}
          onChange={(e) => updateForm('roomId', e)}
        >
          <option>-</option>
          {ROOMS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'roomIsEmpty') ? (
          <span style={{}}>La salle est obligatoire</span>
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
            <option key={t} value={t}>
              {t === TOUTE_LA_SALLE ? 'Toute la salle' : t + ' tables'}
            </option>
          ))}
        </Form.Select>
        {state?.submitted && hasError(errors, 'tablesIsEmpty') ? (
          <span style={{}}>Le nombre de tables est obligatoire</span>
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
