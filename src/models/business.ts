import { Address } from "./address";
import { Category } from "./category";
import { EntryModel } from "./common";
import { Payment } from "./payment";

export interface Tax {
  rate: number;
  cost: number;
}

export interface Business extends EntryModel {
  name: string;
  ownerName: string;
  number: string;
  email: string;
  phoneNumber: string;
  website: string;
  tax: Tax;
  address: Address;
  payments: Payment[];
  logo: string;
  user: string;
  message?: string;
}

export interface BusinessRequest {
  name: string;
  email: string;
  website: string;
  tax: Tax;
  address?: Address;
  payments?: string[];
  user?: string;
}

export interface BusinessTaxRequest {
  tax: Tax;
}
