import {Address} from './address';
import {ActiveStatus, EntryModel} from './common';
import {Payment} from './payment';

export interface Client extends EntryModel {
  name: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  address: Address;
  payments: Payment[];
  note?: string;
  favorite?: boolean;
  status: ActiveStatus;
  user: string;
  contact: string;
}

export interface ClientRequest {
  name: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  address: Address;
  payments: Payment[];
  favorite?: boolean;
  note?: string;
  user: string;
  contact: string;
}

export interface ClientFavoriteRequest {
  favorite: boolean;
}

export interface ClientSearchByNameRequest {
  name: string;
  categories?: string[];
  start?: string;
  end?: string;
  min?: number | null;
  max?: number | null;
}

export enum ClientStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}