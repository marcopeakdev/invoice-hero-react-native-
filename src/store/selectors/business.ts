import {createSelector} from 'reselect';
import {store} from '../store';

const selectBusinessStore = (s: ReturnType<typeof store.getState>) =>
  s.business;

export const selectBusiness = createSelector(
  [selectBusinessStore],
  businessStore => businessStore,
);
