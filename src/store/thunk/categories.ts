import {createAsyncThunk} from '@reduxjs/toolkit';
import {api, ApiRequestEnum} from '../../utils/api';
import {Pagination} from '../../models/common';
import {Category} from '../../models/category';

export const loadCategories = createAsyncThunk(
  'categories/load_categories',
  async (): Promise<Category[]> => {
    try {
      const {data} = await api.post<Pagination<Category>>(
        ApiRequestEnum.LOAD_CATEGORIES,
        {
          status: 'Active',
        },
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

export const updateCategory = createAsyncThunk(
  'categories/update_category',
  async (
    {id, ...request}: Partial<Category> & {id: string},
    thunk,
  ): Promise<Category> => {
    try {
      const {data} = await api.put<Category>(
        ApiRequestEnum.CATEGORY_UPDATE + '/' + id,
        request,
      );

      thunk.dispatch(loadCategories());

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const createCategory = createAsyncThunk(
  'categories/update_category',
  async (request: Partial<Category>, thunk): Promise<Category> => {
    try {
      const {data} = await api.post<Category>(
        ApiRequestEnum.CATEGORY_CREATE,
        request,
      );

      thunk.dispatch(loadCategories());

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);
