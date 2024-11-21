import {EntryModel} from './common';

export interface Address extends EntryModel {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AddressRequest {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
