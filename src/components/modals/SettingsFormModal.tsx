import { useCallback, useEffect, useState } from 'react';
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
import SettingsForm from '../forms/SettingsForm';

type Props = ModalPageProps & {
  onSuccess: (userData: User) => void;
  onCancel: () => void;
};

function validateForm(formData: User): ValidationErrors {
  return {
    nameIsEmpty: isEmpty(formData.name),
  };
}

export default function SettingsFormModal({
  onCancel,
  onSuccess,
  ...props
}: Props) {
  const [user] = useUser();
  const [userData, setUserData] = useState<User>({ ...user });
  const [formState, setFormState] = useState<FormState>({ submitted: false });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [loading] = useState(false);

  const onFormChange = useCallback(
    (changes: User) => {
      setUserData((prev) => ({ ...prev, ...changes }));
    },
    [userData]
  );

  useEffect(() => {
    const errors = validateForm(userData);
    setErrors(errors);
  }, [userData]);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      disabled: loading || saving,
      variant: 'secondary',
      onClick: () => onCancel(),
    },
    {
      name: 'save',
      label: 'Enregistrer',
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
    <ModalPage {...props} options={{ title: 'Préférences', actions: ACTIONS }}>
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
