import {createSelector} from 'reselect';
import {store} from '../store';

const selectDashboardStore = (s: ReturnType<typeof store.getState>) =>
  s.dashboard;

export const selectActiveBlocks = createSelector(
  [selectDashboardStore],
  dashboardStore => dashboardStore.activeBlocks,
);
