import { Category } from './category';
import { Client } from './client';
import { EntryModel } from './common';
import { Payment } from './payment';

export enum InvoiceStatus {
  Estimate = 'Estimate',
  Unpaid = 'Unpaid',
  Paid = 'Paid',
  PartiallyPaid = 'PartiallyPaid'
}

export interface InvoiceSignature {
  uri: string;
  createdAt: string;
}

export enum InvoiceStatusText {
  Estimate = 'Estimate',
  Unpaid = 'UnPaid',
  Paid = 'Fully Paid',
  PartiallyPaid = 'Partially Paid'
}


export enum InvoiceTab {
  All = 'All',
  UnPaid = 'UnPaid Invoices',
  Paid = 'Paid Invoices'
}

export enum InvoiceMenuAction {
  Print = 'Print',
  Download = 'Download',
  Share = 'Share'
}

export interface InvoiceDelivery {
  email: string;
  text: string;
  sharedLink?: string;
  isDefaultMessage?: boolean;
}

export interface InvoicePaymentRequest {
  email?: string;
  text?: string;
  isDefaultMessage?: boolean;
  id: string;
  payments?: string[];
  paymentType?: string;
}

export interface InvoiceCustom {
  name: string;
  description: string;
}

export interface InvoiceItem {
  description: string;
  rate: number;
  hours: number;
  isDefault: boolean | false;
  selected: boolean | false;
}

export interface Invoice extends EntryModel {
  token: string;
  reference: number;
  number: string;
  date: string;
  dueDate: string;
  paidDate?: string | null;
  recurringPeriod: number;
  delivery: InvoiceDelivery;
  items: InvoiceItem[];
  customs: InvoiceCustom[];
  note: string;
  billTo?: Client;
  payments: Payment[];
  category: Category;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  deposit: number;
  total: number;
  attachments: any[];
  status: InvoiceStatus;
  signature: InvoiceSignature;
  paypalId?: string;
  isExpense?: boolean | false;
}

export interface InvoiceRequest {
  number: string;
  date: string;
  dueDate: string;
  recurringPeriod: number;
  delivery: InvoiceDelivery;
  items: InvoiceItem[];
  customs: InvoiceCustom[];
  billTo: string;
  payments: string[];
  category: string;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  total: number;
  attachments: string[];
  status: InvoiceStatus;
}

export interface InvoiceDate {
  date: string;
  dueDate: string;
  recurringPeriod: number;
}

export interface InvoiceDetail {
  items: InvoiceItem[];
  category: Category;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  total: number;
}

export interface CategoryOverview {
  _id: string;
  category: Category;
  sum: number;
}

export interface BalanceOverview {
  _id: InvoiceStatus;
  sum: number;
  sumDeposit: number;
}

export interface ClientOverview {
  _id: string;
  client: Client;
  sum: number;
}

export interface DateOverview {
  _id: string;
  client?: {
    name: string;
  };
  number: string;
  date: string;
  dueDate: string;
  paidDate: string;
  total: number;
  status: InvoiceStatus;
  deposit?: number;
  billTo?: {
    name: string
  }
}

export interface InvoicesCount {
  count: number;
}

export interface InvoiceFilter {
  clients: string[];
  categories: string[];
  amount:
  | {
    min: number;
    max: number;
  }
  | undefined;
  range:
  | {
    start: string;
    end: string | null;
  }
  | undefined;
}
