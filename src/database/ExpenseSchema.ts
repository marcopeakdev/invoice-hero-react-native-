import { BSON } from 'realm';

export class ExpenseSchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;

  static generate(item: any) {
    const createdAt = new Date().toISOString();
    return {
      ...item,
      _id: new BSON.ObjectID(),
      merchant: item.billTo,
      user: new BSON.ObjectID(item.user),
      createdBy: new BSON.ObjectID(item.user),
      updatedBy: new BSON.ObjectID(item.user),
      createdAt: createdAt,
      updatedAt: createdAt,
      purpose: item.purpose || '',
      items: item.items || [],
      attachments: item.attachments || [],
    };
  }

  static schema = {
    name: 'expenses',
    properties: {
      _id: 'objectId',
      purpose: {
        type: 'string?'
      },
      date: {
        type: 'date?'
      },
      items: {
        type: "InvoiceItem[]",
        default: []
      },
      tax: {
        type: 'double?'
      },
      taxRate: {
        type: 'int?'
      },
      discount: {
        type: 'double?'
      },
      discountRate: {
        type: 'int?'
      },
      subTotal: {
        type: 'double?'
      },
      total: {
        type: 'double?'
      },
      attachments: {
        type: 'string[]',
        default: []
      },
      merchant: {
        type: 'clients?',
      },
      user: {
        type: 'objectId?',
      },
      isDeleted: {
        type: 'bool?'
      },
      createdBy: {
        type: 'objectId?',
      },
      updatedBy: {
        type: 'objectId?',
      },
      createdAt: {
        type: 'date?'
      },
      updatedAt: {
        type: 'date?'
      },
    },
    primaryKey: '_id',
  };
}

