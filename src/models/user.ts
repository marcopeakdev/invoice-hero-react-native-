import { ActiveStatus, EntryModel, HumanName } from './common';

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
}

export enum SourceType {
  Google = 'google',
  Facebook = 'facebook',
  Normal = 'Normal'
}

export interface AccountSource {
  sourceType: SourceType,
  sourceId: string
}
export interface User extends EntryModel {
  name: HumanName;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  role: UserRole;
  lastLogin: string;
  subscription: string;
  subscriptionEndAt: Date;
  status: ActiveStatus;
  source: AccountSource;
  partnerPaypalMeta: any;
  isEnableOnlinePayment: Boolean;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  password: string;
}
