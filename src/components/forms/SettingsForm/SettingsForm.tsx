import { Form } from 'react-bootstrap';
import { ACTIVITIES } from '../../../constants/Activities';
import { ROLES } from '../../../constants/Roles';
import type { User } from '../../../model/User';
import { hasError, type CustomFormProps } from '../../../utils/FormUtils';
import RadioGroup from '../../common/RadioGroup';

import FormError from '../../common/FormError/FormError';
import './SettingsForm.scss';

export default function SettingsForm({
  disabled,
  ...props
}: CustomFormProps<User>) {
  const activities = ACTIVITIES.filter((a) => a.filterable).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div>
      <Form.Group className="mb-3" controlId="eventForm.NameInput">
        <Form.Label>Nom</Form.Label>
        <Form.Control
          type="text"
          placeholder="Prénom ou Pseudo"
          className="username"
          disabled={disabled}
          value={props.formData?.name || ''}
          onChange={(e) =>
            props.onChange({
              ...props.formData,
              name: e.target.value,
            })
          }
        />
        {props.state?.submitted && hasError(props.errors, 'nameIsEmpty') ? (
          <FormError error="Veuillez indiquer votre nom ou pseudo (ou les deux)" />
        ) : null}
      </Form.Group>
      <div className="settings-group">
        <RadioGroup
          label="Activités"
          informations="Sélectionner ci-dessous les activités que vous soutaitez voir sur la page d'accueil."
          value={props.formData.preferences?.activities || []}
          onChange={(activities) => {
            props.onChange({
              ...props.formData,
              preferences: { ...props.formData.preferences, activities },
            });
          }}
          options={[...activities].map((act) => ({
            value: act.id,
            label: act.name,
          }))}
        />
      </div>
      <div className="settings-group roles">
        <RadioGroup
          label="Rôles additionnels"
          informations="Certaines fonctionnalités de l'application sont accessibles avec des rôles particuliers. Sélectionnez ci-dessous les vôtres."
          value={props.formData.preferences?.roles || []}
          onChange={(roles) => {
            props.onChange({
              ...props.formData,
              preferences: { ...props.formData.preferences, roles },
            });
          }}
          options={ROLES.map((r) => ({
            value: r.id,
            label: r.label,
          }))}
        />
      </div>
    </div>
  );
}
