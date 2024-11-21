import { BSON } from 'realm';
import { string } from 'yup';
import { ActiveStatus } from '../models/common';

export enum Priority {
  Severe = 0,
  High = 1,
  Medium = 2,
  Low = 3,
}


export class PaymentSchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  type?: string;
  status?: string;
  name?: string;

  static schema = {
    name: 'payments',
    properties: {
      _id: 'objectId',
      type: 'string?',
      status: 'string?',
      name: 'string?',
      user: 'objectId?'
    },
    primaryKey: '_id',
  };
}

