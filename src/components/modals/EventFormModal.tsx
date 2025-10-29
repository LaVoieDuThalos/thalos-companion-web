import { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { JUSQUA_LA_FERMETURE } from '../../constants/Durations';
import { TOUTE_LA_SALLE } from '../../constants/Rooms';
import { useAlert } from '../../hooks/useAlert';
import { useUser } from '../../hooks/useUser';
import type { AgendaEvent } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';
import {
  isFormValid,
  Validators,
  type FormState,
  type ValidationErrors,
} from '../../utils/FormUtils';
import { isEmpty, isZero } from '../../utils/Utils';
import ActivityIndicator from '../common/ActivityIndicator';
import type {
  ModalAction,
  ModalPageProps,
} from '../common/ModalPage/ModalPage';
import ModalPage from '../common/ModalPage/ModalPage';
import View from '../common/View';
import EventForm from '../forms/EventForm/EventForm';

export type FormData = {
  id?: string;
  title: string;
  dayId: string;
  start: string;
  end?: string;
  activityId: string;
  roomId: string;
  roomIsAvailable: boolean;
  tables: number;
  durationInMinutes: number;
  description?: string;
  creatorId?: string;
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

function validateForm(formData: FormData): ValidationErrors {
  return {
    nameIsEmpty: isEmpty(formData.title),
    nameIsLower: Validators.min(formData.title, 3),
    nameIsHigher: Validators.max(formData.title, 40),
    nameIsInvalid: !Validators.allowedCharacters(formData.title),
    dateIsEmpty: isEmpty(formData.dayId, [EMPTY_OPTION, HYPHEN_EMPTY_OPTION]),
    dateIsPassed: Validators.dateIsPassed(new Date(formData.dayId)),
    startHourIsEmpty: isEmpty(formData.start, [
      EMPTY_OPTION,
      HYPHEN_EMPTY_OPTION,
    ]),
    durationIsEmpty: isZero(formData.durationInMinutes),
    roomIsEmpty: isEmpty(formData.roomId, [EMPTY_OPTION, HYPHEN_EMPTY_OPTION]),
    roomIsOccupied: !formData.roomIsAvailable,
    activityIsEmpty: isEmpty(formData.activityId, [
      EMPTY_OPTION,
      HYPHEN_EMPTY_OPTION,
    ]),
    tablesIsEmpty: isZero(formData.tables),
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
      tables: event && event.tables ? event.tables : TOUTE_LA_SALLE,
      description: event ? event.description : '',
      ...event,
    }) satisfies FormData;

  const [formData, setFormData] = useState<FormData>(emptyForm());

  const [formState, setFormState] = useState<FormState>({ submitted: false });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const { user } = useUser();
  const alerts = useAlert();

  const resetForm = () => {
    setFormData(emptyForm());
    setFormState({ submitted: false });
    setErrors({});
  };

  const saveForm = (formData: FormData) => {
    setSaving(true);
    agendaService
      .saveEvent({
        ...formData,
        creator:
          user != null
            ? {
                id: user.id,
                name: user.name,
              }
            : {},
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
      setErrors(validateForm(formData));
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
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        if (isFormValid(validationErrors)) {
          saveForm(formData);
        }
      },
    },
  ];

  return (
    <ModalPage
      {...props}
      onShow={resetForm}
      onHide={onCancel}
      options={{
        title: props.title || 'Créer un nouvel évènement',
        actions: ACTIONS,
      }}
    >
      {saving ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : null}
      {!saving ? (
        <>
          <EventForm
            formData={formData}
            errors={errors}
            state={formState}
            onChange={setFormData}
            disabled={saving}
          />
        </>
      ) : null}
    </ModalPage>
  );
}
