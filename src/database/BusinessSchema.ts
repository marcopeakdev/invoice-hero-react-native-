
import { BSON } from 'realm';
import { Invoice } from '../models/invoice';
import md5 from 'md5'
import { ActiveStatus } from '../models/common';
import { Address } from '../models/address';
import { Payment } from '../models/payment';
import { AddressSchema } from './AddressSchema';
import { ClientStatus } from '../models/client';

export enum Priority {
  Severe = 0,
  High = 1,
  Medium = 2,
  Low = 3,
}


export class BusinessSchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  // name?: string;
  // companyName?: string;
  // phoneNumber?: string;
  // email?: string;
  // payments?: Payment[];
  // note?: string;
  // favorite?: boolean;
  // status?: ActiveStatus;
  // user?: string;
  message?: string;

  // static generate(item: any) {
  //   const createdAt = new Date().toISOString()
  //   return {
  //     ...item,
  //     _id: new BSON.ObjectID(),
  //     createdBy: new BSON.ObjectID(item.user),
  //     updatedBy: new BSON.ObjectID(item.user),
  //     createdAt,
  //     updatedAt: createdAt,
  //   }
  // }

  static schema = {
    name: 'businesses',
    properties: {
      _id: 'objectId',
      // name: 'string?',
      // companyName: 'string?',
      // phoneNumber: 'string?',
      // email: 'string?',
      // address: 'addresses?',
      // payments: 'string[]',
      // note: 'string?',
      // favorite: 'bool?',
      // status: {
      //   type: 'string?',
      //   default: ClientStatus.Active
      // },
      // user: 'objectId?',
      // contact: 'string?',
      // createdBy: 'objectId?',
      // updatedBy: 'objectId?',
      // createdAt: 'date',
      // updatedAt: 'date',
      message: 'string?'
    },
    primaryKey: '_id',
  };
}

