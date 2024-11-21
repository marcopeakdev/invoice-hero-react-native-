import axios from 'axios';

// export const baseURL = 'http://192.168.5.142:3001/api/v1';
export const baseURL = 'https://invoice-hero.com/api/v1';

export const api = axios.create({
  baseURL,
});

export enum ApiRequestEnum {
  GET_USER = '/users/me',
  DELETE_USER = '/users/me',
  SIGN_IN = '/auth/signin',
  SIGN_UP = '/auth/signup',
  CHANGE_PASSWORD = '/users/change-password',
  RESET_PASSWORD = '/reset-password/request',
  INVOICE_BALANCE_OVERVIEW = '/invoices/balance-overview',
  INVOICE_CLIENT_OVERVIEW = '/invoices/client-overview',
  INVOICE_CATEGORY_OVERVIEW = '/invoices/category-overview',
  INVOICE_DATE_OVERVIEW = '/invoices/date-overview',
  INVOICE_SEARCH = '/invoices/search',
  INVOICE_SINGLE = '/invoices/',
  INVOICE_UPDATE = '/invoices/',
  INVOICE_DELETE = '/invoices/',
  EXPENSE_DELETE = '/expenses/',
  ATTACHMENTS_UPLOAD = '/attachments/upload',
  INVOICE_COUNT = '/invoices/count',
  INVOICE_CREATE = '/invoices',
  CLIENT_CREATE = '/clients',
  CLIENT_UPDATE = '/clients',
  LOAD_CLIENT='/clients/',
  LOAD_CLIENTS = '/clients/search',
  SEARCH_CLIENT_NAME = '/clients/search-by-name',
  LOAD_SUBSCRIPTIONS = '/subscriptions',
  APPLY_SUBSCRIPTIONS = '/subscriptions/apply',
  LOAD_PAYMENTS = '/payments/search',
  LOAD_CATEGORIES = '/categories/search',
  CATEGORY_CREATE = '/categories',
  CATEGORY_UPDATE = '/categories',
  BUSINESS_LOGO_UPLOAD = '/businesses/upload',
  GET_USER_BUSINESS = '/businesses/me',
  UPDATE_BUSINESS = '/businesses/',
  CREATE_BUSINESS = '/businesses',
  REQUEST_PAYMENT = '/invoices/:id/request-payment',
  REQUEST_PAYMENT_MERCHANT = '/invoices/:id/request-payment-merchant',
  REQUEST_CARD_PAYMENT = '/invoices/:id/request-card-payment',
  PAYPAL_PARTNER_SIGNUP = '/paypal-partner-signup'
}
