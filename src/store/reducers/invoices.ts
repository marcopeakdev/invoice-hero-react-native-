import { createSlice } from '@reduxjs/toolkit';
import {
  getInvoiceCount,
  loadChartInvoice,
  loadInvoiceBalanceOverview,
  loadInvoiceCategoriesOverview,
  loadInvoiceClientsOverview,
  loadInvoiceDateOverview,
  loadListInvoice,
  loadSearchInvoice,
  loadSearchPaidInvoice,
  loadSearchUnPaidInvoice,
  loadSingleInvoice,
  requestPaymentInvoice,
  updateInvoice,
} from '../thunk/invoices';
import {
  BalanceOverview,
  CategoryOverview,
  ClientOverview,
  DateOverview,
  Invoice,
} from '../../models/invoice';

type OverviewObject<T> = {
  result: T[];
  loading: boolean;
  error: any;
};

type Type = {
  balanceOverview: OverviewObject<BalanceOverview>;
  clientsOverview: OverviewObject<ClientOverview>;
  categoryOverview: OverviewObject<CategoryOverview>;
  dateOverview: OverviewObject<DateOverview>;
  singleInvoice: {
    result: Invoice | null;
    loading: boolean;
    error: any;
  };
  listInvoices: OverviewObject<DateOverview> & { next: boolean };
  searchInvoices: {
    result: Invoice[];
    loading: boolean;
    error: any;
    total: number;
  };
  searchPaidInvoices: {
    result: Invoice[];
    loading: boolean;
    error: any;
    total: number;
  };
  searchUnPaidInvoices: {
    result: Invoice[];
    loading: boolean;
    error: any;
    total: number;
  };
  invoiceCount: number;
  chartInvoices: OverviewObject<Invoice>;
};

const initDefault = {
  result: [],
  loading: false,
  error: null,
};

const initialState: Type = {
  balanceOverview: initDefault,
  clientsOverview: initDefault,
  categoryOverview: initDefault,
  dateOverview: initDefault,
  singleInvoice: {
    result: null,
    loading: false,
    error: null,
  },
  listInvoices: {
    result: [],
    loading: false,
    error: null,
    next: false,
  },
  searchInvoices: {
    result: [],
    loading: false,
    error: null,
    total: 0,
  },
  searchPaidInvoices: {
    result: [],
    loading: false,
    error: null,
    total: 0,
  },
  searchUnPaidInvoices: {
    result: [],
    loading: false,
    error: null,
    total: 0,
  },
  invoiceCount: 0,
  chartInvoices: initDefault,
};

export const invoicesState = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearDateOverview: state => {
      state.dateOverview = initialState.dateOverview;
    },
    clearSingleInvoice: state => {
      state.singleInvoice = initialState.singleInvoice;
    },
    clearListInvoice: state => {
      state.listInvoices = initialState.listInvoices;
    },
    clearSearchInvoice: state => {
      state.searchInvoices = initialState.searchInvoices;
      state.searchPaidInvoices = initialState.searchPaidInvoices;
      state.searchUnPaidInvoices = initialState.searchUnPaidInvoices;
    },
    increaseInvoiceCount: state => {
      state.invoiceCount += 1;
    },
    clearStoreInvoices: state => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getInvoiceCount.fulfilled, (state, action) => {
        state.invoiceCount = action.payload;
      })
      .addCase(loadInvoiceBalanceOverview.pending, state => {
        state.balanceOverview = {
          ...state.balanceOverview,
          loading: true,
        };
      })
      .addCase(loadInvoiceBalanceOverview.fulfilled, (state, action) => {
        state.balanceOverview = {
          ...state.balanceOverview,
          result: action.payload,
          loading: false,
        };
      })
      .addCase(loadInvoiceBalanceOverview.rejected, state => {
        state.balanceOverview = {
          ...state.balanceOverview,
          loading: false,
        };
      })
      //  -----------------CLIENT OVERVIEW---------------------------------
      .addCase(loadInvoiceClientsOverview.pending, state => {
        state.clientsOverview = {
          ...state.clientsOverview,
          loading: true,
        };
      })
      .addCase(loadInvoiceClientsOverview.fulfilled, (state, action) => {
        state.clientsOverview = {
          ...state.clientsOverview,
          result: action.payload,
          loading: false,
        };
      })
      .addCase(loadInvoiceClientsOverview.rejected, state => {
        state.clientsOverview = {
          ...state.clientsOverview,
          loading: false,
        };
      })
      //  -----------------CATEGORY OVERVIEW---------------------------------
      .addCase(loadInvoiceCategoriesOverview.pending, state => {
        state.categoryOverview = {
          ...state.categoryOverview,
          loading: true,
        };
      })
      .addCase(loadInvoiceCategoriesOverview.fulfilled, (state, action) => {
        state.categoryOverview = {
          ...state.categoryOverview,
          result: action.payload,
          loading: false,
        };
      })
      .addCase(loadInvoiceCategoriesOverview.rejected, state => {
        state.categoryOverview = {
          ...state.categoryOverview,
          loading: false,
        };
      })
      //  -----------------DATE OVERVIEW---------------------------------
      .addCase(loadInvoiceDateOverview.pending, state => {
        state.dateOverview = {
          ...state.dateOverview,
          loading: true,
        };
      })
      .addCase(loadInvoiceDateOverview.fulfilled, (state, action) => {
        state.dateOverview = {
          ...state.dateOverview,
          result: action.payload.result,
          loading: false,
        };
      })
      .addCase(loadInvoiceDateOverview.rejected, state => {
        state.dateOverview = {
          ...state.dateOverview,
          loading: false,
        };
      })
      //  -----------------SINGLE INVOICE---------------------------------
      .addCase(loadSingleInvoice.pending, state => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: true,
        };
      })
      .addCase(loadSingleInvoice.fulfilled, (state, action) => {
        state.singleInvoice = {
          ...state.singleInvoice,
          result: action.payload,
          loading: false,
        };
      })
      .addCase(loadSingleInvoice.rejected, state => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: false,
        };
      })
      .addCase(updateInvoice.pending, state => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: true,
        };
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: false,
          result: action.payload,
        };
      })
      .addCase(updateInvoice.rejected, state => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: false,
        };
      })
      .addCase(requestPaymentInvoice.pending, state => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: true,
        };
      })
      .addCase(requestPaymentInvoice.fulfilled, (state, action) => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: false,
          result: action.payload,
        };
      })
      .addCase(requestPaymentInvoice.rejected, state => {
        state.singleInvoice = {
          ...state.singleInvoice,
          loading: false,
        };
      })
      //  -----------------LIST INVOICES---------------------------------
      .addCase(loadListInvoice.pending, state => {
        state.listInvoices = {
          ...state.listInvoices,
          loading: true,
        };
      })
      .addCase(loadListInvoice.fulfilled, (state, action) => {
        state.listInvoices = {
          ...state.listInvoices,
          result: [
            ...(state.listInvoices.result as DateOverview[]),
            ...action.payload.result,
          ],
          next: action.payload.next,
          loading: false,
        };
      })
      .addCase(loadListInvoice.rejected, state => {
        state.listInvoices = {
          ...state.listInvoices,
          loading: false,
        };
      })
      //  -----------------SEARCH INVOICES---------------------------------
      .addCase(loadSearchInvoice.pending, state => {
        state.searchInvoices = {
          ...state.searchInvoices,
          loading: true,
        };
      })
      .addCase(loadSearchInvoice.fulfilled, (state, action) => {
        state.searchInvoices = {
          ...state.searchInvoices,
          result: [...state.searchInvoices.result, ...action.payload.items],
          total: action.payload.total,
          loading: false,
        };
      })
      .addCase(loadSearchInvoice.rejected, state => {
        state.searchInvoices = {
          ...state.searchInvoices,
          loading: false,
        };
      })
      //  -----------------SEARCH PAID INVOICES---------------------------------
      .addCase(loadSearchPaidInvoice.pending, state => {
        state.searchPaidInvoices = {
          ...state.searchPaidInvoices,
          loading: true,
        };
      })
      .addCase(loadSearchPaidInvoice.fulfilled, (state, action) => {
        state.searchPaidInvoices = {
          ...state.searchPaidInvoices,
          result: [...state.searchPaidInvoices.result, ...action.payload.items],
          total: action.payload.total,
          loading: false,
        };
      })
      .addCase(loadSearchPaidInvoice.rejected, state => {
        state.searchPaidInvoices = {
          ...state.searchPaidInvoices,
          loading: false,
        };
      })

      //  -----------------SEARCH UNPAID INVOICES---------------------------------
      .addCase(loadSearchUnPaidInvoice.pending, state => {
        state.searchUnPaidInvoices = {
          ...state.searchUnPaidInvoices,
          loading: true,
        };
      })
      .addCase(loadSearchUnPaidInvoice.fulfilled, (state, action) => {
        state.searchUnPaidInvoices = {
          ...state.searchUnPaidInvoices,
          result: [...state.searchUnPaidInvoices.result, ...action.payload.items],
          total: action.payload.total,
          loading: false,
        };
      })
      .addCase(loadSearchUnPaidInvoice.rejected, state => {
        state.searchUnPaidInvoices = {
          ...state.searchUnPaidInvoices,
          loading: false,
        };
      })

      //  -----------------CHART INVOICES---------------------------------
      .addCase(loadChartInvoice.pending, state => {
        state.chartInvoices = {
          ...state.chartInvoices,
          loading: true,
        };
      })
      .addCase(loadChartInvoice.fulfilled, (state, action) => {
        state.chartInvoices = {
          ...state.chartInvoices,
          result: action.payload.items,
          loading: false,
        };
      })
      .addCase(loadChartInvoice.rejected, state => {
        state.chartInvoices = {
          ...state.chartInvoices,
          loading: false,
        };
      });
  },
});

export const {
  clearDateOverview,
  clearSingleInvoice,
  clearListInvoice,
  clearSearchInvoice,
  increaseInvoiceCount,
  clearStoreInvoices,
} = invoicesState.actions;

export const invoiceReducer = invoicesState.reducer;
