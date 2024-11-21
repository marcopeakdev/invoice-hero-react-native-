import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, ApiRequestEnum } from '../../utils/api';
import { showMessage } from 'react-native-flash-message';
import { AxiosError } from 'axios';

export const deleteExpense = createAsyncThunk(
  'expenses/delete_expense',
  async (request: { id: string }): Promise<any> => {
    try {
      const { id } = request;

      const { data } = await api.delete(ApiRequestEnum.EXPENSE_DELETE + id);

      showMessage({
        message: 'Delete expense success!',
        type: 'success',
      });

      return data;
    } catch (e: AxiosError | any) {
      if (e) {
        showMessage({
          message:
            e.response.data?.error ||
            e.response.data?.message ||
            'Error happens',
          type: 'danger',
        });
        console.log(e.response.data);
      }
    }
  },
);

