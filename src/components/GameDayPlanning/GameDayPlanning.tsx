import { useNavigate } from 'react-router';
import type { AgendaEvent } from '../../model/AgendaEvent';
import AgendaEventCard from '../AgendaEventCard/AgendaEventCard';

type Props = {
  events: AgendaEvent[];
};
export default function GameDayPlanning({ events }: Props) {
  const navigate = useNavigate();

  return (
    <>
      {events?.length === 0 ? (
        <div>
          <span>Rien de prévu pour l&lsquo;instant</span>
        </div>
      ) : (
        events.map((e) => (
          <AgendaEventCard
            key={e.id}
            event={e}
            options={{ hideDate: true }}
            onPress={() => navigate(`/${e.id}`)}
          />
        ))
      )}
    </>
  );
}
