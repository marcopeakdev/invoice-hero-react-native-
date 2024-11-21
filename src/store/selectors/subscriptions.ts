import {createSelector} from 'reselect';
import {store} from '../store';

const selectSubscriptionStore = (s: ReturnType<typeof store.getState>) =>
  s.subscriptions;

export const selectSubscriptions = createSelector(
  [selectSubscriptionStore],
  subscriptionStore => subscriptionStore,
);
