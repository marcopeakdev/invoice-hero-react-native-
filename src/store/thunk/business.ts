import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, ApiRequestEnum } from '../../utils/api';
import { Business } from '../../models/business';

export const getUserBusiness = createAsyncThunk(
  'business/get_user_business',
  async (): Promise<Business | null> => {
    try {
      const { data } = await api.get<Business>(ApiRequestEnum.GET_USER_BUSINESS);

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const createUserBusiness = createAsyncThunk(
  'business/create_user_business',
  async (request: Partial<Business>, thunk): Promise<Business> => {
    try {
      const { data } = await api.post<Business>(ApiRequestEnum.CREATE_BUSINESS, request);

      thunk.dispatch(getUserBusiness());
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
);

export const updateUserBusiness = createAsyncThunk(
  'business/update_user_business',
  async ({_id, ...request}: Partial<Business> & {_id: string},
    thunk
    ): Promise<Business> => {
    try {
      const { data } = await api.put<Business>(ApiRequestEnum.UPDATE_BUSINESS + _id, request);

      thunk.dispatch(getUserBusiness());

      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
);

