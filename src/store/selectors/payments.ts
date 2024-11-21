import {createSelector} from 'reselect';
import {store} from '../store';

const selectPaymentStore = (s: ReturnType<typeof store.getState>) => s.payments;

export const selectPayments = createSelector(
  [selectPaymentStore],
  paymentStore => paymentStore.result,
);
