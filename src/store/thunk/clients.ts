import {createAsyncThunk} from '@reduxjs/toolkit';
import {api, ApiRequestEnum} from '../../utils/api';
import {Pagination} from '../../models/common';
import {Client, ClientSearchByNameRequest} from '../../models/client';
import {Category} from '../../models/category';

export const loadClients = createAsyncThunk(
  'clients/load_clients',
  async (): Promise<Client[]> => {
    try {
      const {data} = await api.post<Pagination<Client>>(
        ApiRequestEnum.LOAD_CLIENTS,
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

export const searchByClientName = createAsyncThunk(
  'clients/client_name',
  async (
    request: ClientSearchByNameRequest,
  ): Promise<(Client & {sum: number})[]> => {
    try {
      const {data} = await api.post<(Client & {sum: number})[]>(
        ApiRequestEnum.SEARCH_CLIENT_NAME,
        request,
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

export const updateClient = createAsyncThunk(
  'clients/update_client',
  async (
    {id, ...request}: Partial<Client> & {id: string},
    thunk,
  ): Promise<Client> => {
    try {
      const {data} = await api.put<Client>(
        ApiRequestEnum.CLIENT_UPDATE + '/' + id,
        request,
      );

      thunk.dispatch(loadClients());

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);


export const loadSingleClient = createAsyncThunk(
  'clients/load_client',
  async (
    request: any
  ): Promise<Client> => {
    const { id } = request;

    try {
      const {data} = await api.get(
        ApiRequestEnum.LOAD_CLIENT + id
      );

      return data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  },
);

