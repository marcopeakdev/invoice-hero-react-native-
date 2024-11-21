import { BSON } from 'realm';
import { string } from 'yup';
import { ActiveStatus } from '../models/common';

export enum Priority {
  Severe = 0,
  High = 1,
  Medium = 2,
  Low = 3,
}


export class CategorySchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name?: string;
  business?: string;
  user?: Realm.BSON.ObjectId;
  status?: ActiveStatus;

  static generate(item: any) {
    return {
      ...item,
      status: ActiveStatus.Active,
      user: new BSON.ObjectId(item.user),
      _id: new BSON.ObjectId(),
    }
  }

  static schema = {
    name: 'categories',
    properties: {
      _id: 'objectId',
      name: 'string?',
      business: 'string?',
      user: 'objectId?',
      status: 'string?'
    },
    primaryKey: '_id',
  };
}

