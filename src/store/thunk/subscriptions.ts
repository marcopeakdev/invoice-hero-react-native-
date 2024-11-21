import {createAsyncThunk} from '@reduxjs/toolkit';
import {api, ApiRequestEnum} from '../../utils/api';
import {Subscription} from '../../models/subscription';

export const loadSubscriptions = createAsyncThunk(
  'subscriptions/load_subscriptions',
  async (): Promise<Subscription[]> => {
    try {
      const {data} = await api.get<Subscription[]>(
        ApiRequestEnum.LOAD_SUBSCRIPTIONS,
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);
