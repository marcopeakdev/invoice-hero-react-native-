import {createSlice} from '@reduxjs/toolkit';
import {loadSubscriptions} from '../thunk/subscriptions';
import {Subscription} from '../../models/subscription';

type Type = {
  result: Subscription[];
  loading: boolean;
  error: any;
};

const initialState: Type = {
  result: [],
  loading: false,
  error: null,
};

export const subscriptionState = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearStoreSubscriptions: state => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(loadSubscriptions.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload;
    });
    builder.addCase(loadSubscriptions.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loadSubscriptions.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export const {clearStoreSubscriptions} = subscriptionState.actions;

export const subscriptionReducer = subscriptionState.reducer;
