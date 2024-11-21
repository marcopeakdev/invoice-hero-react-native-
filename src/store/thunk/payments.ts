import {createAsyncThunk} from '@reduxjs/toolkit';
import {api, ApiRequestEnum} from '../../utils/api';
import {Pagination} from '../../models/common';
import {Payment} from '../../models/payment';

export const loadPayments = createAsyncThunk(
  'payments/load_payments',
  async (): Promise<Payment[]> => {
    try {
      const {data} = await api.post<Pagination<Payment>>(
        ApiRequestEnum.LOAD_PAYMENTS,
        {},
        {
          params: {
            limit: 1000,
            page: 1,
          },
        },
      );

      return data.items;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);
