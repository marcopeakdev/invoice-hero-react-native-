import { ActiveStatus, EntryModel } from "./common"

export interface Category extends EntryModel {
  name: string;
  business: string;
  user: string;
  status: ActiveStatus;
}

export interface CategoryRequest {
  name: string;
  business: string;
  user: string;
}
