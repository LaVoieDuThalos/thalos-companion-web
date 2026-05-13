export const Globals = {
  BASE_URL: '/thalos-companion-web',
  HEADER_HEIGHT_IN_PX: 54,
  FOOTER_HEIGHT_IN_PX: 38,
  ICS_CALENDAR_API: 'thalos-ics.perrinel.fr',
  ADD_TO_GOOGLE_AGENDA_URL: (myServerUrl: string) =>
    `https://www.google.com/calendar/render?cid=${myServerUrl}&title=ThalosAgenda`,
};
