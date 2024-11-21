import {createAsyncThunk} from '@reduxjs/toolkit';
import {showMessage} from 'react-native-flash-message';
import {api, ApiRequestEnum} from '../../utils/api';
import {SignInDTO} from '../../dto/user';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AxiosError} from 'axios';

export const getUser = createAsyncThunk('user/get_user', async () => {
  try {
    const {data} = await api.get(ApiRequestEnum.GET_USER);

    return data;
  } catch (e) {
    console.log(e);

    throw e;
  }
});

export const deleteUser = createAsyncThunk('user/delete_user', async () => {
  try {
    const {data} = await api.delete(ApiRequestEnum.DELETE_USER);

    return data;
  } catch (e) {
    console.log(e);

    throw e;
  }
});

export const signIn = createAsyncThunk(
  'user/sign_in',
  async (request: SignInDTO) => {
    try {
      const {data} = await api.post(ApiRequestEnum.SIGN_IN, request);

      if (data.token) {
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      }

      return data;
    } catch (e: AxiosError | any) {
      console.log(e);
      if (e.response) {
        showMessage({
          message: e.response.data?.error || 'Error happens',
          type: 'danger',
        });
        console.log(e.response.data.error);
      }

      throw e;
    }
  },
);

export const signUp = createAsyncThunk(
  'user/sign_up',
  async (request: SignInDTO) => {
    try {
      const {data} = await api.post(ApiRequestEnum.SIGN_UP, request);

      if (data.token) {
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      }

      showMessage({
        message: 'Your account has been registered successfully.',
        type: 'success',
      });

      return data;
    } catch (e: AxiosError | any) {
      if (e.response) {
        showMessage({
          message: e.response.data?.error || 'Error happens',
          type: 'danger',
        });
        console.log(e.response.data.error);
      }

      throw e;
    }
  },
);
