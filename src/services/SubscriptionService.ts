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

  async subscribe(user: User, subscriptionName: string, event: AgendaEvent): Promise<EventSubscription> {
    const subs = await this.findAllSubscriptionsOfEvent(event);
    if (this.alreadySubscribed(user.id, subs)) {
      return Promise.reject('Already subscribed !');
    } else {
      return this.findAllSubscriptionsOfEvent(event)
        .then((subs_1) => {
          let status = 'waiting';
          const eventComplete =
            event.maxSubscriptions !== undefined &&
            subs_1.length >= event.maxSubscriptions;
          if (event.subscriptionMode === 'auto' && !eventComplete) {
            status = 'validated';
          }
          return {
            id: uuid(),
            user: {
              id: user.id,
              name: user.name,
            },
            name: subscriptionName,
            eventId: event.id,
            subscribedAt: new Date().toISOString(),
            status: status,
          } as EventSubscription;
        })
        .then((subscription_1) =>
          this.api
            .subscribeUserToEvent(subscription_1)
            .then(() => subscription_1)
        );
    }
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
