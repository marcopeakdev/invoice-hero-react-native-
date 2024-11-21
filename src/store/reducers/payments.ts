import {createSlice} from '@reduxjs/toolkit';
import {Payment} from '../../models/payment';
import {loadPayments} from '../thunk/payments';

type Type = {
  result: Payment[];
  loading: boolean;
  error: any;
};

const initialState: Type = {
  result: [],
  loading: false,
  error: null,
};

export const paymentsState = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearStorePayments: state => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(loadPayments.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload;
    });
  },
});

export const {clearStorePayments} = paymentsState.actions;

export const paymentsReducer = paymentsState.reducer;
