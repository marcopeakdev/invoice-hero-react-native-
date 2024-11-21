import { BSON } from 'realm';

export enum Priority {
  Severe = 0,
  High = 1,
  Medium = 2,
  Low = 3,
}


export class AddressSchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;

  static generate(item: any) {
    return {
      ...item,
      _id: new BSON.ObjectId(),
    }
  }

  static schema = {
    name: 'addresses',
    properties: {
      _id: 'objectId',
      street: 'string?',
      apt: 'string?',
      city: 'string?',
      state: 'string?',
      zip: 'string?',
      country: 'string?',
    },
    primaryKey: '_id',
  };
}

