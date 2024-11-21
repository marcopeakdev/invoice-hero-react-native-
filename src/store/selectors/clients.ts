import {createSelector} from 'reselect';
import {store} from '../store';

const selectClientStore = (s: ReturnType<typeof store.getState>) => s.clients;

export const selectClients = createSelector(
  [selectClientStore],
  clientStore => clientStore.clients.result,
);

export const selectClient = createSelector(
  [selectClientStore],
  clientStore => clientStore.client,
);

export const selectClientsByName = createSelector(
  [selectClientStore],
  clientStore => clientStore.searchByClientName,
);

export const selectFilter = createSelector(
  [selectClientStore],
  clientStore => clientStore.searchFilter,
);
