import { useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { ACTIVITIES } from '../../constants/Activities';
import { ROLES } from '../../constants/Roles';
import type { User } from '../../model/User';
import { hasError, type CustomFormProps } from '../../utils/FormUtils';
import IconButton from '../common/IconButton/IconButton';
import RadioGroup from '../common/RadioGroup';
import View from '../common/View';

export default function SettingsForm({
  disabled,
  ...props
}: CustomFormProps<User>) {
  const clearLocalData = () => {
    /* Alert.alert(
      'Réinitialiser toutes les données',
      'Toutes les données locales vont être supprimées. Ok ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            AsyncStorage.clear(() =>
              props.onChange({ ...props.formData, id: '', activities: {} })
            );
          },
        },
      ]
    );*/
    window.alert('Réinitialiser toutes les données');
  };

  const activities = ACTIVITIES.filter((a) => a.filterable).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const formChange = useCallback((formData, source: string) => {
    console.log('source ', source, formData);
    props.onChange({ ...formData });
  }, []);

  return (
    <div>
      <View style={{}}>
        <span>ID: {props.formData.id}</span>
        <IconButton
          icon="delete"
          iconSize={30}
          variant="secondary"
          onClick={clearLocalData}
        />
      </View>

      <Form.Group className="mb-3" controlId="eventForm.NameInput">
        <Form.Label>Nom</Form.Label>
        <Form.Control
          type="Nom"
          placeholder="Prénom ou Pseudo"
          disabled={disabled}
          value={props.formData?.name || ''}
          onChange={(e) =>
            formChange(
              {
                ...props.formData,
                name: e.target.value,
              },
              'name'
            )
          }
        />
        {props.state?.submitted && hasError(props.errors, 'nameIsEmpty') ? (
          <span style={{}}>Le pseudo est obligatoire</span>
        ) : null}
      </Form.Group>

      <RadioGroup
        label="Rôles additionnels"
        value={props.formData.preferences?.roles || []}
        onChange={(roles) => {
          formChange(
            {
              ...props.formData,
              preferences: { ...props.formData.preferences, roles },
            },
            'roles'
          );
        }}
        options={ROLES.map((r) => ({
          value: r.id,
          label: r.label,
        }))}
      />

      <RadioGroup
        label="Activités"
        value={props.formData.preferences?.activities || []}
        onChange={(activities) => {
          formChange(
            {
              ...props.formData,
              preferences: { ...props.formData.preferences, activities },
            },
            'activities'
          );
        }}
        options={activities.map((act) => ({
          value: act.id,
          label: act.name,
        }))}
      />
    </div>
  );
}
