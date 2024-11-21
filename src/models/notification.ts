import { EntryModel } from "./common";

export interface Notification extends EntryModel {
  type: string;
  title: string;
  content: string;
  cost?: number;
}
