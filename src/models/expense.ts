import { Client } from './client';
import { EntryModel } from './common';

export interface ExpenseItem {
  description: string;
  rate: number;
  hours: number;
  isDefault: boolean | false;
  selected: boolean | false;
}

export interface Expense extends EntryModel {
  purpose: string;
  date: string;
  items: ExpenseItem[];
  merchant?: Client;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  total: number;
  attachments: any[];
  isDeleted: boolean | false;
}

export interface ExpenseRequest {
  purpose: string;
  date: string;
  items: ExpenseItem[];
  merchant?: Client;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  total: number;
  attachments: string[];
  isDeleted: boolean | false;
}

export interface ExpenseDateOverview {
  _id: string;
  purpose: string;
  date: string;
  total: number;
  deposit?: number;
  merchant?: {
    name: string
  }
}