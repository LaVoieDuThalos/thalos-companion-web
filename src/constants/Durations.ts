export type Duration = {
  valueInMinutes: number;
  label: string;
};

export const JUSQUA_LA_FERMETURE: Duration = {
  valueInMinutes: 999,
  label: "Jusqu'à la fermeture de la salle",
};

export const Durations: Duration[] = [
  {
    valueInMinutes: 30,
    label: '30min',
  },
  {
    valueInMinutes: 60,
    label: '1h',
  },
  {
    valueInMinutes: 90,
    label: '1h30',
  },
  {
    valueInMinutes: 120,
    label: '2h',
  },
  {
    valueInMinutes: 150,
    label: '2h30',
  },
  {
    valueInMinutes: 180,
    label: '3h',
  },
  {
    valueInMinutes: 240,
    label: '4h',
  },
  {
    valueInMinutes: 300,
    label: '5h',
  },
  {
    valueInMinutes: 360,
    label: '6h',
  },
  JUSQUA_LA_FERMETURE,
];

export function durationToString(
  durationInMinutes: number
): Duration | undefined {
  return Durations.find((d) => d.valueInMinutes === durationInMinutes);
}

export function parseDuration(label: string): Duration | undefined {
  return Durations.find((d) => d.label === label.trim().toLowerCase());
}
