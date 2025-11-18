import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import AgendaEventCard from '../../components/AgendaEventCard/AgendaEventCard';
import EventFormModal from '../../components/modals/EventFormModal';
import { AppContext } from '../../contexts/AppContext';
import type { AgendaEvent } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const appContext = useContext(AppContext);
  const [event, setEvent] = useState<AgendaEvent | undefined>(undefined);
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [refresh, setRefresh] = useState('');
  const navigate = useNavigate();

  const onDeleteEvent = () => {
    navigate('/');
  };

  const onEditEvent = () => {
    setEventFormModalVisible(true);
  };

  useEffect(() => {
    if (eventId === undefined) {
      return;
    }

    agendaService.findEventById(eventId).then((e) => {
      if (e === null) {
        console.error('No event found with id ', eventId);
      } else {
        setEvent(e);
      }
      //appContext.setLoading(false);
    });
    //.catch(() => appContext.setLoading(false));
  }, [eventId, refresh]);
  return (
    <>
      {eventFormModalVisible && (
        <EventFormModal
          show
          onCancel={() => setEventFormModalVisible(false)}
          event={event}
          onSuccess={(event) => {
            setEventFormModalVisible(false);
            setRefresh(new Date().toISOString());
            appContext.refresh(`home.events`);
            appContext.refresh(`agenda.${event?.day.id}`);
          }}
        />
      )}
      {event ? (
        <AgendaEventCard
          event={event}
          complete={true}
          showButtons={true}
          onDelete={onDeleteEvent}
          onEdit={onEditEvent}
        />
      ) : null}
    </>
  );
}
