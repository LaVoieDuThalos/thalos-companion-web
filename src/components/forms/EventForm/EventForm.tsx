import { Alert, Button, Form, Image } from 'react-bootstrap';
import { ACTIVITIES, EVENEMENT, JDR } from '../../../constants/Activities';
import { Durations } from '../../../constants/Durations';
import {
  AUTRE_SALLE,
  ROOMS,
  SALLE_DU_LAC,
  TOUTE_LA_SALLE,
} from '../../../constants/Rooms';
import { calendarService } from '../../../services/CalendarService';
import { type CustomFormProps, hasError } from '../../../utils/FormUtils';
import { fromGameDayId, fromRoomId, printGameDay } from '../../../utils/Utils';
import {
  type FormData,
  HYPHEN_EMPTY_OPTION,
} from '../../modals/EventFormModal';

import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { EVENT_SUBSCRIPTION_MODES } from '../../../constants/EventSubscriptionModes';
import { Globals } from '../../../constants/Globals';
import { ROLE_BUREAU } from '../../../constants/Roles.ts';
import { useUser } from '../../../hooks/useUser';
import type { Room } from '../../../model/Room';
import type { TablesAvailables } from '../../../services/BookingService';
import { roomService } from '../../../services/RoomService';
import { settingsService } from '../../../services/SettingsService';
import FormError from '../../common/FormError/FormError';
import Icon from '../../common/Icon';
import NumberInput from '../../common/NumberInput/NumberInput';
import RichEditor from '../../common/RichEditor/RichEditor';
import RoomPriorities from '../../RoomPriorities/RoomPriorities';
import './EventForm.scss';
import type { GameDay } from '../../../model/GameDay.ts';

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

const isUnusualSchedule = (dayId: string, hour: number) => {
  const day = new Date(dayId).getDay();
  const weekEnd = [5, 6];
  return (weekEnd.includes(day) && hour < 20) || !weekEnd.includes(day);
};

export default function EventForm({
  disabled,
  state,
  onChange,
  errors,
  formData,
  availableTables,
}: Props) {
  const [showMoreInfos, setShowMoreInfos] = useState(
    formData.img !== '' ||
      formData.discordChannel !== '' ||
      formData.description !== ''
  );

  const [moreDays, setMoreDays] = useState(false);

  let extraDays: GameDay[] = [];
  if (formData.dayId !== undefined && formData.dayId !== HYPHEN_EMPTY_OPTION) {
    extraDays = [fromGameDayId(formData.dayId)!];
  }

  const days = calendarService.buildDaysFromDate(
    new Date(),
    60,
    moreDays,
    extraDays
  );
  const hours = calendarService.hours();
  const durations = Durations;
  const { user, hasRole } = useUser();

  const integerFields = ['durationInMinutes', 'tables', 'maxSubscriptions'];
  const booleanFields = ['withSubscriptions'];

  const updateForm = (field: string, event: Event) => {
    if (field === 'dayId' && event.target.value === 'moreDays') {
      setMoreDays(true);
      return;
    }
    if (field === 'roomId') {
      // reset tables selection when room changes
      formData.tables = 0;
    }
    if (field === 'subscriptionMode') {
      formData.subscriptionMode = event.target.value;
    }

    const newFormData = {
      ...formData,
      [field]:
        integerFields.indexOf(field) >= 0
          ? parseInt(event.target.value)
          : booleanFields.indexOf(field) >= 0
            ? event.target.value === 'true'
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
          <option value={'moreDays'}>Plus de dates ...</option>
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

        {formData.start &&
        isUnusualSchedule(formData.dayId, parseInt(formData.start)) &&
        (formData.roomId === undefined ||
          (formData.roomId !== AUTRE_SALLE.id &&
            formData.activityId !== EVENEMENT.id)) ? (
          <Alert variant="warning">
            <Icon icon="warning" iconSize={22} />
            Vous avez indiqué une horaire hors ouverture normale de la salle.
            <p>
              Renseignez-vous au préalable sur l'ouverture de la salle sous{' '}
              <a
                href="https://discord.com/channels/677657875736166410/761516258176401419"
                target="_blank"
              >
                Discord
              </a>
              .
            </p>
          </Alert>
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
          {ACTIVITIES.filter(
            (act) =>
              settingsService.activityVisible(user.preferences || {}, act.id) &&
              (act.id != EVENEMENT.id || hasRole(ROLE_BUREAU))
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
              (!room.virtual || hasRole(ROLE_BUREAU))
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
                {tables === undefined ||
                tables === TOUTE_LA_SALLE ||
                r.id === AUTRE_SALLE.id
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

      {/* Autre salle ---------------------------------------------------------*/}
      {formData.roomId === AUTRE_SALLE.id && (
        <>
          <Form.Group className="mb-3" controlId="eventForm.otherRoomName">
            <Form.Label>Nom de la salle</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              className="other-room-name"
              disabled={disabled}
              value={formData.otherRoomName}
              onChange={(e) => updateForm('otherRoomName', e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="eventForm.otherRoomAddress">
            <Form.Label>Adresse de la salle</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              className="other-room-address"
              disabled={disabled}
              value={formData.otherRoomAddress}
              onChange={(e) => updateForm('otherRoomAddress', e)}
            />
            <span>Url du plan</span> :
            <Form.Control
              type="text"
              placeholder="Url du plan (Google map, open maps, etc..)"
              className="other-room-map-url"
              disabled={disabled}
              value={formData.otherRoomMapUrl}
              onChange={(e) => updateForm('otherRoomMapUrl', e)}
            />
            {state?.submitted &&
            hasError(errors, 'otherRoomMapUrlIsInvalid') ? (
              <FormError error="L'URL est invalide. Elle doit commencer par 'https://" />
            ) : null}
          </Form.Group>
        </>
      )}

      {/* Tables ------------------------------------------------------------- */}
      {formData.roomId !== AUTRE_SALLE.id && (
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
      )}

      <div className="inscriptions-section">
        {/* Inscriptions ------------------------------------------------------------- */}
        <Form.Group className="mb-3" controlId="eventForm.InscriptionsInput">
          <Form.Label>Inscriptions des participants</Form.Label>
          <Form.Select
            size="lg"
            disabled={disabled}
            value={formData.withSubscriptions + ''}
            onChange={(e) => updateForm('withSubscriptions', e)}
          >
            {['Sans', 'Avec'].map((option) => (
              <option key={option} value={`${option === 'Avec'}`}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Nbres de places max ------------------------------------------------------------- */}
        {formData.withSubscriptions ? (
          <Form.Group
            className="mb-3"
            controlId="eventForm.MaxInscriptionsInput"
          >
            <NumberInput
              label="Nombre de places"
              min={1}
              value={formData.maxSubscriptions || 1}
              onChange={(e) =>
                updateForm('maxSubscriptions', {
                  target: {
                    value: `${e}`,
                  },
                })
              }
            />
          </Form.Group>
        ) : null}

        {/* Mode d'inscription ------------------------------------------------------------- */}
        {formData.withSubscriptions ? (
          <Form.Group
            className="mb-3"
            controlId="eventForm.SubscriptionModeInput"
          >
            <Form.Label>Sélection des participants</Form.Label>
            <Form.Select
              size="lg"
              disabled={disabled}
              value={formData.subscriptionMode}
              onChange={(e) => updateForm('subscriptionMode', e)}
            >
              {EVENT_SUBSCRIPTION_MODES.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        ) : null}
      </div>

      <div className="more-infos">
        <Button
          variant="outline-dark"
          style={{ width: '100%' }}
          onClick={() => setShowMoreInfos((prev) => !prev)}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignContent: 'center',
              fontWeight: 'bold',
            }}
          >
            Plus d'infos
            <Icon
              icon={showMoreInfos ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              iconSize={30}
            />
          </div>
        </Button>

        <div
          className="more-infos-body"
          style={{ display: showMoreInfos ? 'block' : 'none' }}
        >
          {/* Salon Discord ------------------------------------------------------------- */}
          <Form.Group
            className="mb-3"
            controlId="eventForm.DiscordChannelInput"
          >
            <Form.Label>
              <Image
                src={Globals.BASE_URL + '/icons/discord.png'}
                width={22}
                height={22}
                roundedCircle
              />
              URL du salon Discord dédié (facultatif)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              className="discord-channel"
              disabled={disabled}
              value={formData.discordChannel}
              onChange={(e) => updateForm('discordChannel', e)}
            />
            {state?.submitted && hasError(errors, 'discordChannelIsInvalid') ? (
              <FormError error="L'URL est invalide. Elle doit être sous la forme de 'https://discord.com/channels/xxxxx" />
            ) : null}
          </Form.Group>

          {/* Affiche ------------------------------------------------------------- */}
          <Form.Group className="mb-3" controlId="eventForm.ImgInput">
            <Form.Label>
              URL de l'illustration / Affiche (facultatif)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              className="img"
              disabled={disabled}
              value={formData.img}
              onChange={(e) => updateForm('img', e)}
            />
            {state?.submitted && hasError(errors, 'imgIsInvalid') ? (
              <FormError error="L'URL est invalide. Elle doit être sous la forme de 'https://**" />
            ) : null}
          </Form.Group>

          {/* Description ------------------------------------------------------------- */}
          <Form.Group className="mb-3" controlId="eventForm.DescriptionInput">
            <Form.Label>Description (facultatif)</Form.Label>
            <RichEditor
              value={formData.description}
              onChange={(e) => updateForm('description', e)}
            />
          </Form.Group>
        </div>
      </div>
    </Form>
  );
}
