import { Form, Image } from 'react-bootstrap';
import { ACTIVITIES } from '../../../constants/Activities';
import { ROLE_BUREAU, ROLES } from '../../../constants/Roles';
import type { User } from '../../../model/User';
import { type CustomFormProps, hasError } from '../../../utils/FormUtils';
import RadioGroup from '../../common/RadioGroup';

import FormError from '../../common/FormError/FormError';
import './SettingsForm.scss';
import { useState } from 'react';
import { useUser } from '../../../hooks/useUser.ts';
import { Globals } from '../../../constants/Globals.ts';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard.ts';
import IconButton from '../../common/IconButton/IconButton.tsx';

function createIcsUrl(provider: string, userId: string): string {
  const baseUrl = `${Globals.ICS_CALENDAR_API}/user/${userId}/events.ics`;

  switch (provider) {
    case 'google':
      return Globals.ADD_TO_GOOGLE_AGENDA_URL(
        encodeURIComponent(`webcal://${baseUrl}`)
      );
    case 'apple':
      return `webcal://${baseUrl}`;
  }
  return `https://${baseUrl}`;
}

export function SettingsForm({ disabled, ...props }: CustomFormProps<User>) {
  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState('activities');
  const { copyToClipboard } = useCopyToClipboard();

  const tabs = [
    { name: 'activities', title: 'Activités' },
    { name: 'roles', title: 'Rôles' },
  ];

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
      <ul className="nav nav-pills nav-fill">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.name}>
            <a
              className={
                'nav-link' + (currentTab === tab.name ? ' active' : '')
              }
              href="#"
              onClick={() => setCurrentTab(tab.name)}
            >
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
      {currentTab === 'activities' && (
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
      )}
      {currentTab === 'roles' && (
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
              disabled: r.id === ROLE_BUREAU.id,
            }))}
          />
        </div>
      )}
      <hr />
      <div>
        <strong>Calendrier personnalisé (Expérimental)</strong>
        <div className="alert alert-secondary" role="alert">
          <p>
            Vous trouverez ci-dessous les liens pour intégrer les évènements de
            l'application sur votre calendrier préféré.
          </p>
          <p>
            <Image src={'icons/google-calendar.png'} width={'32px'} /> Pour
            Google Agenda, il faudra le faire depuis un ordinateur en utilisant
            "<strong>A partir de l'URL ...</strong>" et renseignant l'url
            ci-dessous.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 5, padding: '10px' }}>
          {/*
            <a
              className="btn btn-outline-secondary"
              href={createIcsUrl('google', user.id)}
              target="_blank"
              role="button"
            >
              <Image src={'icons/google-calendar.png'} width={'32px'} />
              Google Agenda
            </a>
          */}

          <a
            className="btn btn-outline-secondary"
            href={createIcsUrl('ics', user.id)}
            target="_blank"
            role="button"
          >
            <Image src={'icons/ics-format.png'} width={'32px'} />
            Fichier iCal
          </a>

          <a
            className="btn btn-outline-secondary"
            href={createIcsUrl('apple', user.id)}
            target="_blank"
            role="button"
          >
            <Image src={'icons/apple-logo.png'} width={'32px'} /> Apple
          </a>
        </div>
        <div>
          <div role="button" style={{ display: 'flex' }}>
            URL : {createIcsUrl('ics', user.id)}
            &nbsp;
            <IconButton
              icon={'content_copy'}
              iconSize={16}
              onClick={() => copyToClipboard(createIcsUrl('ics', user.id))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
