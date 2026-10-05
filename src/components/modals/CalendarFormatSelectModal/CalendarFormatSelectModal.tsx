import { Button, Image } from 'react-bootstrap';
import ModalPage from '../../common/ModalPage/ModalPage';
import { google, ics, type CalendarEvent } from 'calendar-link';
import type { AgendaEvent } from '../../../model/AgendaEvent';

type Props = {
  event: AgendaEvent;
  show: boolean;
  onHide: () => void;
};

type CalendarFormat = {
  name: string;
  img: string;
  value: string;
  onSelect: () => void;
};

function mapEventToCalendarEvent(event: AgendaEvent): CalendarEvent {
  let eventDuration = event.durationInMinutes || 0;
  const startTime =
    (event.startTime || 0) + new Date().getTimezoneOffset() * 60 * 1000;

  if (eventDuration === 999) {
    const hh = new Date(startTime).getHours();
    eventDuration = (24 - hh) * 60; // Calculate duration until midnight
  }
  const endTime = startTime + eventDuration * 60 * 1000; // Calculate end time based on duration
  return {
    title: event.title,
    start: startTime, // Adjust for timezone offset
    end: endTime, // Adjust for timezone offset
    description: event.description,
    location: event.room?.name || '',
    duration: [eventDuration, 'minutes'],
  };
}

export default function CalendarFormatSelectModal({
  event,
  onHide,
  ...props
}: Props) {
  const calendarEvent = mapEventToCalendarEvent(event);
  console.log(calendarEvent);
  const availableFormats: CalendarFormat[] = [
    {
      name: 'Google Calendar',
      img: 'icons/google-calendar.png',
      value: 'google',
      onSelect: () => {
        open(google(calendarEvent), '_blank');
      },
    },
    {
      name: 'Apple Calendar',
      img: 'icons/apple-logo.png',
      value: 'apple',
      onSelect: () => {
        open(ics(calendarEvent), '_blank');
      },
    },
    /* {
      name: 'Outlook',
      img: 'icons/outlook.png',
      value: 'outlook',
      onSelect: () => {},
    },
    {
      name: 'Yahoo Calendar',
      img: 'icons/yahoo-calendar.png',
      value: 'yahoo',
      onSelect: () => {},
    },*/
    {
      name: 'iCalendar',
      img: 'icons/ics-format.png',
      value: 'ical',
      onSelect: () => {
        open(ics(calendarEvent), '_blank');
      },
    },
  ];

  return (
    <ModalPage
      {...props}
      onHide={onHide}
      options={{
        title: 'Ajouter au calendrier',
        actions: [{ name: 'Annuler', onClick: onHide, variant: 'secondary' }],
      }}
    >
      <p>Choisissez un format de calendrier :</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {availableFormats.map((format) => (
          <div key={format.value}>
            <Button
              onClick={format.onSelect}
              variant="outline-primary"
              className="mb-2"
            >
              <Image src={format.img} width={'32px'} />
              &nbsp;{format.name}
            </Button>
          </div>
        ))}
      </div>
    </ModalPage>
  );
}
