import {createSlice} from '@reduxjs/toolkit';
import {loadApp} from '../thunk/main';

type Type = {
  appLoaded: boolean;
};

const initialState: Type = {
  appLoaded: false,
};

export const mainState = createSlice({
  name: 'main',
  initialState,
  reducers: {
    clearStore: state => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(loadApp.fulfilled, (state, action) => {
      state.appLoaded = true;
    });
  },
});

export const {clearStore} = mainState.actions;

export const mainReducer = mainState.reducer;
