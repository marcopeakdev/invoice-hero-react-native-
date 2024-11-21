import {createSelector} from 'reselect';
import {store} from '../store';

const selectMainStore = (s: ReturnType<typeof store.getState>) => s.main;

export const selectIsAppLoaded = createSelector(
  [selectMainStore],
  mainStore => mainStore.appLoaded,
);
