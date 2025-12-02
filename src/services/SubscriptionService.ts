import { API, type ApiService } from '../api/Api';
import type { AgendaEvent, EventSubscription } from '../model/AgendaEvent';
import type { User } from '../model/User';
import { uuid } from '../utils/Utils';

export class SubscriptionService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  alreadySubscribed(
    userId: string,
    subscriptions: EventSubscription[]
  ): boolean {
    return subscriptions.findIndex((s) => s.user.id === userId) >= 0;
  }

  findSubscriptionOfUser(
    userId: string,
    subscriptions: EventSubscription[]
  ): EventSubscription | undefined {
    return subscriptions.find((s) => s.user.id === userId);
  }

  findAllSubscriptionsOfEvent(
    event: AgendaEvent
  ): Promise<EventSubscription[]> {
    return this.api.findAllSubscriptionsOfEvent(event.id);
  }

  subscribe(user: User, event: AgendaEvent): Promise<EventSubscription> {
    return this.findAllSubscriptionsOfEvent(event).then((subs) => {
      if (this.alreadySubscribed(user.id, subs)) {
        return Promise.reject('Already subscribed !');
      } else {
        return this.findAllSubscriptionsOfEvent(event)
          .then((subs) => {
            let status = 'waiting';
            const eventComplete =
              event.maxSubscriptions !== undefined &&
              subs.length >= event.maxSubscriptions;
            if (event.subscriptionMode === 'auto' && !eventComplete) {
              status = 'validated';
            }

            const subscription = {
              id: uuid(),
              user: {
                id: user.id,
                name: user.name,
              },
              eventId: event.id,
              subscribedAt: new Date().toISOString(),
              status: status,
            } as EventSubscription;

            return subscription;
          })
          .then((subscription) =>
            this.api.subscribeUserToEvent(subscription).then(() => subscription)
          );
      }
    });
  }

  unsubscribe(subscriptionId: string): Promise<void> {
    return this.api.unsubscribeUserToEvent(subscriptionId);
  }

  unsubscribeAll(eventId: string): Promise<void> {
    return this.api.unsubscribeAll(eventId);
  }

  updateSubscriptionStatus(
    subscription: EventSubscription,
    status: string
  ): Promise<void> {
    return this.api.updateSubscriptionStatus(subscription, status);
  }
}

export const subscriptionService = new SubscriptionService(API);
