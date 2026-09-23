import ModalPage, { type ModalAction } from '../common/ModalPage/ModalPage.tsx';
import type { AgendaEvent } from '../../model/AgendaEvent.ts';
import { Alert, Form, type ModalProps } from 'react-bootstrap';
import { useState } from 'react';

type FormResult = {
  name: string;
  withTable40k?: boolean;
};

type Props = ModalProps & {
  event: AgendaEvent;
  name?: string;
  withTable40k?: boolean;
  onSuccess?: (r: FormResult) => void;
  onCancel?: () => void;
};

export default function EventSubscriptionModal({
  name,
  withTable40k,
  event,
  onCancel,
  onSuccess,
  ...props
}: Props) {
  const [subscriptionName, setSubscriptionName] = useState<string>(name || '');
  const [subscriptionWithTable40k, setSubscriptionWithTable40k] =
    useState<boolean>(!!withTable40k);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      disabled: false,
      variant: 'secondary',
      onClick: () => {
        if (onCancel !== undefined) {
          onCancel();
        }
      },
    },
    {
      name: 'save',
      label: 'Enregistrer',
      disabled: false,
      onClick: () => {
        if (onSuccess) {
          onSuccess({
            name: subscriptionName,
            withTable40k: subscriptionWithTable40k,
          });
        }
      },
    },
  ];

  return (
    <ModalPage
      {...props}
      onHide={onCancel}
      options={{
        title: "Inscription à l'évènement " + event.title,
        actions: ACTIONS,
      }}
    >
      <Form.Group className="mb-3" controlId="eventForm.NameInput">
        <Form.Label>Votre nom ou pseudo :</Form.Label>
        <Alert variant="light">
          Nom qui doit être affiché sur l'inscription.{' '}
          <i>Exemple pour une rencontre figurines : Nom1 VS Nom2</i>
        </Alert>
        <Form.Control
          type="title"
          placeholder=""
          className="title"
          autoFocus
          value={subscriptionName}
          onChange={(e) => setSubscriptionName(e.target.value)}
        />
      </Form.Group>

      {event.activity?.figurines && (
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            checked={subscriptionWithTable40k}
            label="J'ai besoin d'emprunter une table de l'association"
            onChange={(e) => setSubscriptionWithTable40k(e.target.checked)}
          />
        </Form.Group>
      )}
    </ModalPage>
  );
}
