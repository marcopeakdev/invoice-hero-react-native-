import {InvoiceStatus} from '../models/invoice';

export type InvoiceOverview = {
  statuses?: InvoiceStatus[];
  categories?: string[];
  clients?: string[];
  keyword?: string;
  date?: any[];
  page?: number;
  limit?: number;
};
