import { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { useUser } from '../../hooks/useUser';
import type { User } from '../../model/User';
import { settingsService } from '../../services/SettingsService';
import {
  isFormValid,
  type FormState,
  type ValidationErrors,
} from '../../utils/FormUtils';
import { isEmpty } from '../../utils/Utils';
import ActivityIndicator from '../common/ActivityIndicator';
import type {
  ModalAction,
  ModalPageProps,
} from '../common/ModalPage/ModalPage';
import ModalPage from '../common/ModalPage/ModalPage';
import View from '../common/View';
import SettingsForm from '../forms/SettingsForm/SettingsForm';

type Props = ModalPageProps & {
  welcomeMode?: boolean;
  onSuccess: (userData: User) => void;
  onCancel: () => void;
};

function validateForm(formData: User): ValidationErrors {
  return {
    nameIsEmpty: isEmpty(formData.name),
  };
}

export default function SettingsFormModal({
  welcomeMode,
  onCancel,
  onSuccess,
  ...props
}: Props) {
  const { user } = useUser();
  const [userData, setUserData] = useState<User>({ ...user });
  const [formState, setFormState] = useState<FormState>({ submitted: false });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [loading] = useState(false);

  const onFormChange = (changes: User) => {
    console.log('changes', changes);
    setUserData((prev) => ({ ...prev, ...changes }));
  };

  useEffect(() => {
    const errors = validateForm(userData);
    setErrors(errors);
  }, [userData]);

  useEffect(() => {
    setUserData((prev) => ({ ...prev, ...user }));
  }, [user]);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      disabled: loading || saving || welcomeMode,
      variant: 'secondary',
      onClick: () => onCancel(),
    },
    {
      name: 'save',
      label: welcomeMode ? 'Continuer' : 'Enregistrer',
      disabled: loading || saving,
      onClick: () => {
        setFormState({ ...formState, submitted: true });
        if (isFormValid(errors)) {
          setSaving(true);
          settingsService
            .save({
              ...userData,
            } as User)
            .then((res) => {
              setSaving(false);
              if (onSuccess) {
                try {
                  onSuccess(res);
                } catch (error) {
                  console.error('An error occured in success function', error);
                }
              }
            });

          setSaving(false);
        }
      },
    },
  ];

  return (
    <ModalPage
      {...props}
      options={{
        hideCloseButton: welcomeMode,
        title: welcomeMode ? 'Bienvenue' : 'Préférences',
        actions: ACTIONS,
      }}
    >
      {welcomeMode && (
        <div className="alert alert-secondary" role="alert">
          <p>
            Bienvenue sur l'application <strong>La Voie du Thalos</strong> !
          </p>
          <p>
            {' '}
            Cette application permet de <strong>
              gérer les réservations
            </strong>{' '}
            des salles et{' '}
            <strong>suivre les évènements de l'association</strong> et peut-être
            plus à l'avenir ...
          </p>
        </div>
      )}
      {loading || saving ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : null}
      {!loading && !saving ? (
        <SettingsForm
          formData={userData}
          state={formState}
          errors={errors}
          disabled={saving}
          onChange={onFormChange}
        />
      ) : null}
    </ModalPage>
  );
}
