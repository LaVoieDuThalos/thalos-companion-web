import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import './EventSubscriptions.scss';
import type { AgendaEvent, EventSubscription } from '../../../../model/AgendaEvent.ts';
import { useUser } from '../../../../hooks/useUser.ts';
import Icon from '../../../common/Icon.tsx';
import { Colors } from '../../../../constants/Colors.ts';
import { subscriptionService } from '../../../../services/SubscriptionService.ts';
import CustomCard from '../../../common/CustomCard/CustomCard.tsx';
import { MODE_AUTO_BY_REGISTRATION_DATE, MODE_MANUAL } from '../../../../constants/EventSubscriptionModes.ts';
import EventSubscriptionCard from './components/EventSubscriptionCard/EventSubscriptionCard.tsx';

type Props = {
  event: AgendaEvent;
};

export default function EventSubscriptions({ event }: Props) {
  const [subscriptions, setSubscriptions] = useState<EventSubscription[]>([]);
  const [refresh, setRefresh] = useState('');
  const { user } = useUser();
  const callRefresh = () => setRefresh(new Date().toISOString());

  useEffect(() => {
    subscriptionService.findAllSubscriptionsOfEvent(event).then((subs) => {
      setSubscriptions(subs);
    });
  }, [event, refresh]);

  const subscribe = () => {
    subscriptionService.subscribe(user, event).then(() => {
      callRefresh();
    });
  };
  const unsubscribe = (subId: string) => {
    subscriptionService.unsubscribe(subId).then(() => {
      callRefresh();
    });
  };

  const updateSubscription = (sub: EventSubscription, status: string) => {
    subscriptionService.updateSubscriptionStatus(sub, status).then(() => {
      callRefresh();
    });
  };

  const userSubscription = subscriptionService.findSubscriptionOfUser(
    user.id,
    subscriptions
  );

  const validatedList = subscriptions.filter((s) => s.status === 'validated');

  const waitingList = subscriptions.filter((s) => s.status === 'waiting');
  const availableSeats = (event.maxSubscriptions || 0) - validatedList.length;
  const eventComplete =
    event.maxSubscriptions !== undefined &&
    validatedList.length >= event.maxSubscriptions;

  return (
    <div className="event-subscriptions">
      <hr />
      <Alert variant="info">
        La participation à cet évènement est sur inscription avec un nombre de{' '}
        <strong>{event.maxSubscriptions}</strong> participants maximum.
        <br />
        {event.subscriptionMode === MODE_AUTO_BY_REGISTRATION_DATE.id ? (
          <>
            La sélection des participants est faite{' '}
            <u>automatiquement avec la date d'inscription.</u>
          </>
        ) : (
          <>
            La sélection des participants est faite{' '}
            <u>manuellement par l'organisateur de l'évènement.</u>
          </>
        )}
      </Alert>
      <p className="subscriptions-title">
        Participants{' '}
        {availableSeats > 0 ? (
          <span>
            (Reste <strong>{availableSeats}</strong> place(s))
          </span>
        ) : (
          <span>(Complet)</span>
        )}{' '}
        :
      </p>
      <div className="subscriptions">
        {validatedList.length === 0 ? <p>Pas encore d'inscrit</p> : null}
        {validatedList.map((sub) => (
          <div key={sub.id} className="subscription">
            <EventSubscriptionCard
              event={event}
              sub={sub}
              key={sub.id}
              onUnsubscribe={unsubscribe}
              onUpdateSubscription={updateSubscription}
              userSubscription={userSubscription}
            />
          </div>
        ))}
        {!userSubscription && !eventComplete && waitingList.length === 0 && (
          <div className="empty-seat" key={'emtpysit'}>
            <CustomCard clickable={!userSubscription} onClick={subscribe}>
              <Icon icon="person_add" iconSize={50} color={Colors.gray} />
              {event.subscriptionMode === MODE_MANUAL.id || !eventComplete ? (
                <>S'inscrire</>
              ) : (
                <>S'inscrire sur liste d'attente</>
              )}
            </CustomCard>
          </div>
        )}
      </div>
      {(waitingList.length > 0 || eventComplete) && (
        <div className="subscriptions">
          <hr />
          <p className="subscriptions-title">
            Liste d'attente ({waitingList.length})
          </p>
          <Alert variant="warning">
            {event.subscriptionMode === MODE_AUTO_BY_REGISTRATION_DATE.id ? (
              <span>
                Cet évènement est complet mais vous pouvez tout de même vous y
                inscrire en liste d'attente au cas où une place se libère.
              </span>
            ) : (
              <span>
                Les organisateurs de cet évènement sélectionnent les
                participants parmi ceux inscrits sur la liste d'attente.
              </span>
            )}
          </Alert>

          {waitingList.map((sub) => (
            <div key={sub.id} className="subscription">
              <EventSubscriptionCard
                event={event}
                sub={sub}
                key={sub.id}
                onUnsubscribe={unsubscribe}
                onUpdateSubscription={updateSubscription}
                userSubscription={userSubscription}
              />
            </div>
          ))}
          {!userSubscription && (
            <div className="empty-seat" key={'emtpysit'}>
              <CustomCard clickable={!userSubscription} onClick={subscribe}>
                <Icon icon="person_add" iconSize={50} color={Colors.gray} />
                S'inscrire sur liste d'attente
              </CustomCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
