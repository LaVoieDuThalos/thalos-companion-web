import { Form } from 'react-bootstrap';
import { ACTIVITIES } from '../../constants/Activities';
import { Colors } from '../../constants/Colors';
import type { Activity } from '../../model/Activity';
import {
  parseYesOrNo,
  type UserPreferences,
  type YesOrNo,
} from '../../model/UserPreferences';
import { hasError, type CustomFormProps } from '../../utils/FormUtils';
import IconButton from '../common/IconButton/IconButton';
import Radio from '../common/Radio';
import View from '../common/View';

type ActivityOption = {
  value: YesOrNo;
  label: string;
};

export default function SettingsForm({
  disabled,
  ...props
}: CustomFormProps<UserPreferences>) {
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

  const activityChange = (activity: Activity, value: YesOrNo | undefined) => {
    props.onChange({
      ...props.formData,
      activities: {
        ...props.formData.activities,
        [activity.id]: value ?? 'yes',
      },
    });
  };

  const activities = ACTIVITIES.filter((a) => a.filterable).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div>
      <View style={{}}>
        <span>ID: {props.formData.id}</span>
        <IconButton
          icon="delete"
          color={Colors.black}
          iconSize={30}
          onClick={clearLocalData}
        />
      </View>

      <Form.Group className="mb-3" controlId="eventForm.FirstNameInput">
        <Form.Label>Prénom</Form.Label>
        <Form.Control
          type="Prénom"
          placeholder=""
          disabled={disabled}
          value={props.formData?.firstName || ''}
          onChange={(e) =>
            props.onChange({ ...props.formData, firstName: e.target.value })
          }
        />
        {props.state?.submitted &&
        hasError(props.errors, 'firstNameIsEmpty') ? (
          <span style={{}}>Le prénom est obligatoire</span>
        ) : null}
      </Form.Group>

      <Form.Group className="mb-3" controlId="eventForm.NameInput">
        <Form.Label>Pseudo</Form.Label>
        <Form.Control
          type="Pseudo"
          placeholder=""
          disabled={disabled}
          value={props.formData?.name || ''}
          onChange={(e) =>
            props.onChange({ ...props.formData, name: e.target.value })
          }
        />
        {props.state?.submitted && hasError(props.errors, 'nameIsEmpty') ? (
          <span style={{}}>Le pseudo est obligatoire</span>
        ) : null}
      </Form.Group>

      <View>
        <span>Activités</span>
        {activities.map((act) => (
          <Radio
            key={act.id}
            label={act.name}
            options={[
              { value: 'yes', label: 'Oui' } as ActivityOption,
              { value: 'no', label: 'Non' } as ActivityOption,
            ]}
            value={
              props.formData.activities
                ? props.formData.activities[act.id]
                : 'yes'
            }
            onChange={(val) => activityChange(act, parseYesOrNo(val))}
          />
        ))}
      </View>
    </div>
  );
}
