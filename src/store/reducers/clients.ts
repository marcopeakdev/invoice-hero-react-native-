import { createSlice } from '@reduxjs/toolkit';
import { Client } from '../../models/client';
import { loadClients, loadSingleClient, searchByClientName, updateClient } from '../thunk/clients';

type Type = {
  clients: {
    result: Client[];
    loading: boolean;
    error: any;
  };
  searchByClientName: {
    result: (Client & { sum: number })[];
    loading: boolean;
    error: any;
  };
  searchFilter: {
    categories: string[];
    start: string;
    end: string;
    min: string;
    max: string;
  };
  client: {
    result: Client | null;
    loading: boolean;
    error: any;
  };
};

const initialState: Type = {
  clients: {
    result: [],
    loading: false,
    error: null,
  },
  searchByClientName: {
    result: [],
    loading: false,
    error: null,
  },
  searchFilter: {
    categories: [],
    start: '',
    end: '',
    min: '',
    max: '',
  },
  client: {
    result: null,
    loading: false,
    error: null,
  }
};

export const clientsState = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearStoreClients: state => {
      return {
        ...initialState,
      };
    },
    setFilter: (state, action) => {
      state.searchFilter = {
        ...state.searchFilter,
        ...action.payload,
      };
    },
    clearFilter: state => {
      state.searchFilter = initialState.searchFilter;
    },
    clearSearchByClientName: (state) => {
      state.searchByClientName = initialState.searchByClientName;
    },
    loadClient: (state, action) => {
      state.client = action.payload
    },
    clearClient: (state) => {
      state.client = initialState.client
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadClients.fulfilled, (state, action) => {
        state.clients = {
          ...state.clients,
          loading: false,
          result: action.payload,
        };
      })
      .addCase(searchByClientName.pending, (state, action) => {
        state.searchByClientName = {
          ...state.searchByClientName,
          loading: true,
        };
      })
      .addCase(searchByClientName.rejected, (state, action) => {
        state.searchByClientName = {
          ...state.searchByClientName,
          loading: false,
        };
      })
      .addCase(searchByClientName.fulfilled, (state, action) => {
        state.searchByClientName = {
          ...state.searchByClientName,
          loading: false,
          result: action.payload,
        };
      })
      .addCase(loadSingleClient.pending, (state, action) => {
        state.client = {
          ...state.client,
          loading: true,
        };
      })
      .addCase(loadSingleClient.rejected, (state, action) => {
        state.client = {
          ...state.client,
          loading: false,
        };
      })
      .addCase(loadSingleClient.fulfilled, (state, action) => {
        state.client = {
          ...state.client,
          loading: false,
          result: action.payload,
        };
      })
      .addCase(updateClient.pending, (state, action) => {
        state.client = {
          ...state.client,
          loading: true,
        };
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.client = {
          ...state.client,
          loading: false,
        };
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.client = {
          ...state.client,
          loading: false,
          result: action.payload,
        };
      });
  },
});

export const {
  clearStoreClients,
  setFilter, clearFilter,
  clearSearchByClientName,
  clearClient,
  loadClient
} = clientsState.actions;

export const clientsReducer = clientsState.reducer;