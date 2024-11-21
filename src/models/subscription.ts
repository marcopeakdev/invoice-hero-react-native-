import {ActiveStatus, EntryModel} from './common';

export enum SubscriptionType {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export interface Subscription extends EntryModel {
  name: string;
  description: string;
  image: string;
  androidId: string;
  period: SubscriptionType;
  periodAmount: number;
  cost: number;
  status: ActiveStatus;
  planId: string;
}
