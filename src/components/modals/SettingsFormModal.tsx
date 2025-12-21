import { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import type { AlertDialogAction } from '../../contexts/AlertsContext';
import { useAlert } from '../../hooks/useAlert';
import { useUser } from '../../hooks/useUser';
import type { User } from '../../model/User';
import { settingsService } from '../../services/SettingsService';
import { userService } from '../../services/UserService';
import {
  type FormState,
  isFormValid,
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

type SettingsFormData = User;

type Props = ModalPageProps & {
  welcomeMode?: boolean;
  onSuccess: (userData: User) => void;
  onCancel: () => void;
};

function validateForm(formData: SettingsFormData): ValidationErrors {
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
  const [userData, setUserData] = useState<SettingsFormData>({ ...user });
  const [formState, setFormState] = useState<FormState>({ submitted: false });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [loading] = useState(false);

  const onFormChange = (changes: User) => {
    setUserData((prev) => ({ ...prev, ...changes }));
  };

  const alerts = useAlert();

  useEffect(() => {
    const errors = validateForm(userData);
    setErrors(errors);
  }, [userData]);

  useEffect(() => {
    setUserData((prev) => ({ ...prev, ...user }));
  }, [user]);

  const saveForm = (userData: SettingsFormData) => {
    return settingsService
      .save({ ...userData, name: userData.name?.trim() } as User)
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
  };

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

          userService
            .findUserByName(userData?.name?.trim(), [user.id])
            .then((usersFound) => {
              if (usersFound && usersFound?.length > 0) {
                alerts.dialog(
                  'Utilisateur trouvé',
                  'Un autre utilisateur existe déjà avec ce nom "' +
                    userData?.name?.trim() +
                    '".\nEst-ce que c\'est vous ?',
                  [
                    {
                      label: "Non ce n'est pas moi",
                      onClick: (closeFn) => {
                        closeFn();
                      },
                    } as AlertDialogAction,
                    {
                      label: 'Oui',
                      onClick: (closeFn) => {
                        saveForm(usersFound[0]);
                        closeFn();
                      },
                    } as AlertDialogAction,
                  ]
                );
              } else {
                return saveForm(userData);
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
