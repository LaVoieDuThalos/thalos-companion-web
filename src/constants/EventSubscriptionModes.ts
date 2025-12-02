export type EventSubscriptionMode = {
  id: string;
  label: string;
};

export const MODE_AUTO_BY_REGISTRATION_DATE: EventSubscriptionMode = {
  id: 'auto',
  label: "Sélection automatique basée sur la date d'inscription",
};

export const MODE_MANUAL: EventSubscriptionMode = {
  id: 'manual',
  label: 'Sélection manuelle des inscrits',
};

export const EVENT_SUBSCRIPTION_MODES: EventSubscriptionMode[] = [
  MODE_AUTO_BY_REGISTRATION_DATE,
  MODE_MANUAL,
];
