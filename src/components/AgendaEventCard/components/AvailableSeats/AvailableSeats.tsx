import type { AgendaEvent, EventSubscription, } from '../../../../model/AgendaEvent.ts';
import { Badge } from 'react-bootstrap';

type Props = {
  event: AgendaEvent;
  subscriptions: EventSubscription[];
};

export default function AvailableSeats({ event, subscriptions }: Props) {
  const availableSeats =
    event.maxSubscriptions !== undefined
      ? event.maxSubscriptions - subscriptions.length
      : 0;

  const isComplete =
    event.maxSubscriptions !== undefined &&
    event.maxSubscriptions <= subscriptions.length;

  const almostComplete = availableSeats === 1;

  return (
    <div>
      <Badge
        bg={isComplete ? 'danger' : almostComplete ? 'warning' : 'success'}
      >
        {isComplete
          ? 'COMPLET'
          : `${availableSeats} place${availableSeats > 1 ? 's' : ''} disponible${availableSeats > 1 ? 's' : ''}`}
      </Badge>
    </div>
  );
}
