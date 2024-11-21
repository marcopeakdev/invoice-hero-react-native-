import {createSlice} from '@reduxjs/toolkit';
import {Category} from '../../models/category';
import {loadCategories} from '../thunk/categories';

type Type = {
  result: Category[];
  loading: boolean;
  error: any;
};

const initialState: Type = {
  result: [],
  loading: false,
  error: null,
};

export const categoriesState = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearStoreCategories: state => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(loadCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload;
    });
  },
});

export const {clearStoreCategories} = categoriesState.actions;

export const categoriesReducer = categoriesState.reducer;
