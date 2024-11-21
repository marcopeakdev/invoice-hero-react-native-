import {createSlice} from '@reduxjs/toolkit';

type Type = {
  activeBlocks: {
    label: string;
    show: boolean;
  }[];
};

const initialState: Type = {
  activeBlocks: [
    {
      label: 'Chart overview',
      show: true,
    },
    {
      label: 'Balance overview',
      show: true,
    },
    {
      label: 'Categories overview',
      show: true,
    },
    {
      label: 'Clients overview',
      show: true,
    },
  ],
};

export const dashboardState = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleBlock: (state, action) => {
      state.activeBlocks[action.payload].show =
        !state.activeBlocks[action.payload].show;
    },
    setActiveBlocks: (state, action) => {
      state.activeBlocks = state.activeBlocks.map((item, itemI) => {
        return {
          ...item,
          show: action.payload.includes(itemI),
        };
      });
    },
  },
});

export const {setActiveBlocks, toggleBlock} = dashboardState.actions;

export const dashboardReducer = dashboardState.reducer;
