import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../utils/api';
import {AppState} from '../store';

export const loadApp = createAsyncThunk(
  'main/load_app',
  async (args, {getState}) => {
    const state = getState() as AppState;

    if (state?.user?.token) {
      api.defaults.headers.common.Authorization = `Bearer ${state?.user?.token}`;
    }

    return true;
  },
);
