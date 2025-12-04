import { Button } from 'react-bootstrap';
import { Colors } from '../../../../../../constants/Colors.ts';
import { useUser } from '../../../../../../hooks/useUser.ts';
import type {
  AgendaEvent,
  EventSubscription,
} from '../../../../../../model/AgendaEvent.ts';
import CustomCard from '../../../../../common/CustomCard/CustomCard.tsx';
import Icon from '../../../../../common/Icon.tsx';

type EventSubscriptionProps = {
  event: AgendaEvent;
  sub: EventSubscription;
  userSubscription?: EventSubscription;
  onUnsubscribe: (subId: string) => void;
  onUpdateSubscription: (sub: EventSubscription, status: string) => void;
};

export default function EventSubscriptionCard({
  event,
  sub,
  userSubscription,
  onUnsubscribe,
  onUpdateSubscription,
}: EventSubscriptionProps) {
  const { user, hasRoleReferent } = useUser();
  const currentUserIsTheEventCreator =
    user.id === event.creator?.id ||
    (event.activity && hasRoleReferent(event.activity?.id));
  const subcribedAtDate = new Date(sub.subscribedAt);
  return (
    <CustomCard>
      <div className="subscription-details">
        <div className="user">
          <Icon
            icon={
              sub.status === 'validated'
                ? 'check_circle'
                : sub.status === 'cancelled'
                  ? 'cancel'
                  : 'hourglass'
            }
            color={sub.status === 'validated' ? Colors.green : Colors.blue}
            iconSize={40}
          />
          <span className="name">{sub.name ?? sub.user.name}</span>
        </div>
        {currentUserIsTheEventCreator && (
          <div className="subscribed-at">
            Inscrit(e) le: {subcribedAtDate.toLocaleDateString()} à{' '}
            {subcribedAtDate.toLocaleTimeString()}
          </div>
        )}
        <div className="buttons">
          {userSubscription && sub.id === userSubscription.id && (
            <Button onClick={() => onUnsubscribe(userSubscription.id)}>
              <Icon icon="person_cancel" iconSize={30} color={Colors.red2} />
            </Button>
          )}
          {currentUserIsTheEventCreator && (
            <>
              {(sub.status === 'cancelled' || sub.status === 'waiting') && (
                <Button
                  onClick={() => onUpdateSubscription(sub, 'validated')}
                  variant="secondary"
                  style={{ backgroundColor: Colors.green }}
                >
                  <Icon
                    icon="check_circle"
                    iconSize={30}
                    color={Colors.white}
                  />
                </Button>
              )}
              {(sub.status === 'validated' || sub.status === 'cancelled') && (
                <Button
                  onClick={() => onUpdateSubscription(sub, 'waiting')}
                  variant="secondary"
                  style={{ backgroundColor: Colors.blue }}
                >
                  <Icon icon="hourglass" iconSize={30} color={Colors.white} />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </CustomCard>
  );
}
