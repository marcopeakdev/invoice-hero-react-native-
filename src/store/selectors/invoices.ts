import {createSelector} from 'reselect';
import {store} from '../store';

const selectInvoiceStore = (s: ReturnType<typeof store.getState>) => s.invoices;

export const selectInvoiceCount = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.invoiceCount,
);

export const selectInvoiceBalanceOverview = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.balanceOverview,
);

export const selectInvoiceClientsOverview = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.clientsOverview,
);

export const selectInvoiceCategoriesOverview = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.categoryOverview,
);

export const selectInvoiceDateOverview = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.dateOverview,
);

export const selectSingleInvoice = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.singleInvoice,
);

export const selectListInvoice = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.listInvoices,
);

export const selectSearchInvoice = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.searchInvoices,
);

export const selectSearchPaidInvoice = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.searchPaidInvoices,
);

export const selectSearchUnPaidInvoice = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.searchUnPaidInvoices,
);

export const selectChartInvoice = createSelector(
  [selectInvoiceStore],
  invoiceStore => invoiceStore.chartInvoices,
);
