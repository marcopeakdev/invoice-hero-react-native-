import {createSlice} from '@reduxjs/toolkit';
import {Business} from '../../models/business';
import {createUserBusiness, getUserBusiness} from '../thunk/business';

type Type = {
  result: Business | null;
  loading: boolean;
  error: any;
};

const initialState: Type = {
  result: null,
  loading: false,
  error: null,
};

export const businessState = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearStoreBusiness: state => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(getUserBusiness.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getUserBusiness.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getUserBusiness.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload;
    });
    builder.addCase(createUserBusiness.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createUserBusiness.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createUserBusiness.fulfilled, (state, action) => {
      state.loading = false;
    });
  },
});

export const {clearStoreBusiness} = businessState.actions;

export const businessReducer = businessState.reducer;
