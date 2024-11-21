import {createSelector} from 'reselect';
import {store} from '../store';

const selectCategoriesStore = (s: ReturnType<typeof store.getState>) =>
  s.categories;

export const selectCategories = createSelector(
  [selectCategoriesStore],
  categoriesStore => categoriesStore.result,
);
