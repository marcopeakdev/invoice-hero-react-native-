export interface EntryModel {
  _id: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sortable {
  index: number;
}

export interface Pagination<T> {
  total: number;
  page: number;
  limit: number;
  items: T[];
}

export interface SearchRequest<T> {
  page?: number;
  limit?: number;
  sort?: string;
  desc?: number;
  filter: T;
}

export interface Editable<T> {
  editable?: boolean;
  isLoading?: boolean;
  item: T;
}

export interface Selectable<T> {
  selected: boolean;
  item: T;
}

export interface SortRequest {
  items: { _id: string, index: number }[];
}

export interface ArchiveRequest {
  status: ActiveStatus;
}

export interface HumanName {
  given: string;
  family: string;
}

export interface SelectOption {
  _id: string;
  name: string;
  value: string | number;
  data?: any;
}

export interface SuccessResponse {
  success: boolean;
}

export enum ActiveStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}
