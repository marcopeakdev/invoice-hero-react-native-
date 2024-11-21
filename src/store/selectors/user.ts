import {createSelector} from 'reselect';
import {store} from '../store';

const selectUserStore = (s: ReturnType<typeof store.getState>) => s.user;

export const selectIsAuthorized = createSelector(
  [selectUserStore],
  userStore => userStore.isAuthorized,
);

export const selectIsFirstLogin = createSelector(
  [selectUserStore],
  userStore => userStore.isFirstLogin,
);

export const selectAuthToken = createSelector(
  [selectUserStore],
  userStore => userStore.token,
);

export const selectUser = createSelector(
  [selectUserStore],
  userStore => userStore.user,
);

export const selectSignIn = createSelector(
  [selectUserStore],
  userStore => userStore.signIn,
);

export const selectSignUp = createSelector(
  [selectUserStore],
  userStore => userStore.signUp,
);
