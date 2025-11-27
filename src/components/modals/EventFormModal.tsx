import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { JDR } from '../../constants/Activities';
import { Colors } from '../../constants/Colors';
import { JUSQUA_LA_FERMETURE } from '../../constants/Durations';
import type { EventCreationMode } from '../../constants/EventCreationWizard';
import { TOUTE_LA_SALLE } from '../../constants/Rooms';
import { useAlert } from '../../hooks/useAlert';
import { useUser } from '../../hooks/useUser';
import type { AgendaEvent, LastModification } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';
import {
  bookingService,
  type TablesAvailables,
} from '../../services/BookingService';
import {
  isFormValid,
  Validators,
  type FormState,
  type ValidationErrors,
} from '../../utils/FormUtils';
import {
  fromGameDayId,
  fromRoomId,
  getEndTime,
  getStartTime,
  isEmpty,
  isZero,
} from '../../utils/Utils';
import ActivityIndicator from '../common/ActivityIndicator';
import type {
  ModalAction,
  ModalPageProps,
} from '../common/ModalPage/ModalPage';
import ModalPage from '../common/ModalPage/ModalPage';
import View from '../common/View';
import EventCreateWizard from '../EventCreateWizard/EventCreateWizard';
import EventForm from '../forms/EventForm/EventForm';

export type FormData = {
  id?: string;
  title: string;
  dayId: string;
  start: string;
  end?: string;
  activityId: string;
  gameMaster?: string;
  roomId: string;
  roomIsAvailable: boolean;
  tables: number;
  durationInMinutes: number;
  description?: string;
  creatorId?: string;
  discordChannel?: string;
  img?: string;
};

type Props = ModalPageProps & {
  title?: string;
  dayId?: string;
  roomId?: string;
  activityId?: string;
  event?: AgendaEvent;
  onSuccess?: (event: AgendaEvent) => void;
  onCancel?: () => void;
};

export const EMPTY_OPTION = '';
export const HYPHEN_EMPTY_OPTION = '-';

function isRoomAvailable(
  roomId: string,
  requestedTables: number,
  availablesTables: TablesAvailables
): boolean {
  const room = fromRoomId(roomId);
  if (!room) {
    return false;
  }
  const capacity = room.capacity || TOUTE_LA_SALLE;
  const available = availablesTables[roomId];

  return (
    (requestedTables === TOUTE_LA_SALLE && available === capacity) ||
    requestedTables <= available
  );
}

function validateForm(
  formData: FormData,
  availablesTables: TablesAvailables
): ValidationErrors {
  return {
    nameIsEmpty: isEmpty(formData.title),
    nameIsLower: Validators.min(formData.title, 3),
    nameIsHigher: Validators.max(formData.title, 120),
    nameIsInvalid: !Validators.allowedCharacters(formData.title),
    dateIsEmpty: isEmpty(formData.dayId, [EMPTY_OPTION, HYPHEN_EMPTY_OPTION]),
    dateIsPassed: Validators.dateIsPassed(new Date(formData.dayId)),
    startHourIsEmpty: isEmpty(formData.start, [
      EMPTY_OPTION,
      HYPHEN_EMPTY_OPTION,
    ]),
    durationIsEmpty: isZero(formData.durationInMinutes),
    roomIsEmpty: isEmpty(formData.roomId, [EMPTY_OPTION, HYPHEN_EMPTY_OPTION]),
    roomIsOccupied: !isRoomAvailable(
      formData.roomId,
      formData.tables,
      availablesTables
    ),
    activityIsEmpty: isEmpty(formData.activityId, [
      EMPTY_OPTION,
      HYPHEN_EMPTY_OPTION,
    ]),
    gameMasterIsEmpty:
      formData.activityId === JDR.id && isEmpty(formData.gameMaster),
    gameMasterIsLower:
      formData.activityId === JDR.id &&
      !!formData.gameMaster &&
      Validators.min(formData.gameMaster, 3),
    gameMasterIsHigher:
      formData.activityId === JDR.id &&
      !!formData.gameMaster &&
      Validators.max(formData.gameMaster, 120),
    gameMasterIsInvalid:
      formData.activityId === JDR.id &&
      !Validators.allowedCharacters(formData.title),
    tablesIsEmpty: isZero(formData.tables),
    discordChannelIsInvalid: Validators.notStartsWith(
      formData.discordChannel,
      'https://discord.com/channels'
    ),
    imgIsInvalid: Validators.notStartsWith(formData.img, 'https://'),
  };
}

export default function EventFormModal({
  dayId,
  event,
  onSuccess,
  onCancel,
  ...props
}: Props) {
  const emptyForm = () =>
    ({
      id: undefined,
      title: event ? event.title : EMPTY_OPTION,
      dayId: event ? event.day.id : (dayId ?? HYPHEN_EMPTY_OPTION),
      start: event ? event.start : HYPHEN_EMPTY_OPTION,
      durationInMinutes: event
        ? event.durationInMinutes
        : JUSQUA_LA_FERMETURE.valueInMinutes,
      roomId: event && event.room ? event.room?.id : HYPHEN_EMPTY_OPTION,
      roomIsAvailable: false,
      activityId:
        event && event.activity ? event.activity?.id : HYPHEN_EMPTY_OPTION,
      gameMaster: event ? event.gameMaster : '',
      tables: event && event.tables ? event.tables : TOUTE_LA_SALLE,
      description: event ? event.description : '',
      discordChannel: event && event.discordChannel ? event.discordChannel : '',
      img: event && event.img ? event.img : '',
      ...event,
    }) satisfies FormData;

  const [formData, setFormData] = useState<FormData>(emptyForm());

  const [formState, setFormState] = useState<FormState>({ submitted: false });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [eventTemplate, setEventTemplate] = useState<
    EventCreationMode | undefined
  >(undefined);
  const [availablesTables, setAvailablesTables] = useState<TablesAvailables>(
    {}
  );

  const { user } = useUser();
  const alerts = useAlert();

  const resetForm = () => {
    setFormData(() => emptyForm());
    setFormState({ submitted: false });
    setErrors({});
  };

  const saveForm = (formData: FormData) => {
    setSaving(true);
    agendaService
      .saveEvent({
        ...formData,
        creator:
          user != null && event?.id == null
            ? {
                id: user.id,
                name: user.name,
              }
            : event?.creator,
        lastModification:
          user != null && event?.id !== null
            ? ({
                date: new Date().toISOString(),
                user: {
                  id: user.id,
                  name: user.name,
                },
              } as LastModification)
            : null,
      } as Partial<AgendaEvent>)
      .then((res) => {
        setSaving(false);
        if (onSuccess) {
          try {
            onSuccess(res);
          } catch (error) {
            console.error('An error occured in success function', error);
          }
        }
      })
      .catch((err) => {
        setSaving(false);
        alerts.error(`${err}`);
      });
  };

  useEffect(() => {
    if (formState.submitted) {
      setErrors(validateForm(formData, availablesTables));
    } else {
      updateAvailablesTablesByRooms(formData);
    }
  }, [formData, formState.submitted]);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      disabled: saving,
      variant: 'secondary',
      onClick: () => {
        if (onCancel) {
          onCancel();
        }
      },
    },
    {
      name: 'save',
      label: 'Enregistrer',
      disabled: saving,
      onClick: () => {
        setFormState({ ...formState, submitted: true });
        const validationErrors = validateForm(formData, availablesTables);
        setErrors(validationErrors);
        if (isFormValid(validationErrors)) {
          saveForm(formData);
        }
      },
    },
  ];

  const updateAvailablesTablesByRooms = useCallback((_formData: FormData) => {
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
      });
  }, []);

  return (
    <ModalPage
      {...props}
      onShow={resetForm}
      onHide={onCancel}
      options={{
        title: props.title || 'Créer un nouvel évènement',
        actions: eventTemplate || formData.id ? ACTIONS : [],
      }}
    >
      {saving ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : null}
      {!saving ? (
        <>
          {eventTemplate === undefined && !formData.id && (
            <EventCreateWizard
              onSelect={(mode) => {
                setEventTemplate(mode);
                const initData = mode.formDataFn();
                setFormData((prev) => ({ ...prev, ...initData }) as FormData);
              }}
            />
          )}
          {eventTemplate && (
            <Button
              style={{ width: '100%' }}
              variant="secondary"
              onClick={() => setEventTemplate(undefined)}
            >
              {eventTemplate.label}
            </Button>
          )}
          {(eventTemplate || formData.id) && (
            <EventForm
              formData={formData}
              availableTables={availablesTables}
              errors={errors}
              state={formState}
              onChange={setFormData}
              disabled={saving}
            />
          )}
        </>
      ) : null}
    </ModalPage>
  );
}
