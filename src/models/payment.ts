import { ActiveStatus, EntryModel } from "./common";

export enum PaymentType {
  Credit = 'Credit',
  Checking = 'Checking',
  Cash = 'Cash',
  Custom = 'Custom',
  OnlinePayments='OnlinePayments',
  OnlineCashPayments='OnlineCashPayments',
  CardPayments='CardPayments',
}

export interface Payment extends EntryModel {
  name: string;
  image?: string;
  type: PaymentType;
  status: ActiveStatus;
}

export interface PaymentRequest {
  name: string;
  type: PaymentType;
}

export interface SubscriptionCreateRequest {
  planId: string;
  type: string;
  metadata: object;
}
