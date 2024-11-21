import { BSON } from 'realm';
import { Invoice } from '../models/invoice';
import md5 from 'md5'
import moment from 'moment';

export enum Priority {
  Severe = 0,
  High = 1,
  Medium = 2,
  Low = 3,
}

export class InvoiceSchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  number!: number;

  static generate(item: any) {
    const createdAt = new Date().toISOString();
    return {
      ...item,
      _id: new BSON.ObjectID(),
      billTo: item.billTo,
      user: new BSON.ObjectID(item.user),
      token: md5([item.number, item.total, item.user].join('\0'),),
      createdBy: new BSON.ObjectID(item.user),
      updatedBy: new BSON.ObjectID(item.user),
      createdAt: createdAt,
      updatedAt: createdAt,
      reference: 1,
      items: item.items || [],
      custom: item.custom || [],
      note: item.note || '',
      attachments: item.attachments || [],
      signature: item.signature,
      isExpense: item.isExpense || false,
    };
  }

  static getClientAggregate(body: any, user: any) {
    const match: any = {
      isDeleted: { $ne: true }
    };

    if (body.statuses && body.statuses.length) {
      match.status = { $in: body.statuses };
    }
    if (body.categories && body.categories.length) {
      match.category = { $in: body.categories.map((id: any) => new BSON.ObjectID(id)) }
    }
    if (body.clients && body.clients.length) {
      match.billTo = { $in: body.clients.map((id: any) => new BSON.ObjectID(id)) }
    }
    if (body.min || body.max || body.start || body.end) {
      match.$and = [];
    }
    if (body.min) {
      match.$and.push({ 'total': { $gte: body.min } });
    }
    if (body.max) {
      match.$and.push({ 'total': { $lte: body.max } });
    }
    if (body.start) {
      match.$and.push({ 'date': { $gte: moment(body.start).startOf('day').toDate() } });
    }
    if (body.end) {
      match.$and.push({ 'date': { $lte: moment(body.end).endOf('day').toDate() } });
    }
    match.user = new BSON.ObjectID(user._id);

    const aggr = [
      {
        '$match': {
          status: { $ne: 'Estimate' }
        }
      },
      {
        '$group': {
          _id: '$billTo',
          sum: {
            $sum: '$total'
          }
        },
      },
      {
        '$lookup': {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        '$unwind': {
          path: '$client',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        '$sort': {
          'client.name': 1
        }
      }
    ];

    return ([{ $match: match }, ...aggr])
  }

  static getBalanceAggregate(body: any, user: any) {
    const match: any = {
      isDeleted: { $ne: true }
    };

    if (body.statuses && body.statuses.length) {
      match.status = { $in: body.statuses };
    }
    if (body.categories && body.categories.length) {
      match.category = { $in: body.categories.map((id: any) => new BSON.ObjectId(id)) }
    }
    if (body.clients && body.clients.length) {
      match.billTo = { $in: body.clients.map((id: any) => new BSON.ObjectId(id)) }
    }
    if (body.min || body.max || body.start || body.end) {
      match.$and = [];
    }
    if (body.min) {
      match.$and.push({ 'total': { $gte: body.min } });
    }
    if (body.max) {
      match.$and.push({ 'total': { $lte: body.max } });
    }
    if (body.start) {
      match.$and.push({ 'date': { $gte: moment(body.start).startOf('day').toDate() } });
    }
    if (body.end) {
      match.$and.push({ 'date': { $lte: moment(body.end).endOf('day').toDate() } });
    }
    match.user = new BSON.ObjectID(user._id)

    const aggr = [
      {
        '$group': {
          _id: '$status',
          sum: {
            $sum: '$total'
          },
          sumDeposit: {
            $sum: '$deposit'
          }
        }
      }
    ];

    return [{ $match: match }, ...aggr]
  }

  static getCategoryAggregate(body: any, user: any) {
    const match: any = {
      isDeleted: { $ne: true }
    };

    if (body.statuses && body.statuses.length) {
      match.status = { $in: body.statuses };
    }
    if (body.categories && body.categories.length) {
      match.category = { $in: body.categories.map((id: any) => new BSON.ObjectId(id)) }
    }
    if (body.clients && body.clients.length) {
      match.billTo = { $in: body.clients.map((id: any) => new BSON.ObjectId(id)) }
    }
    if (body.min || body.max || body.start || body.end) {
      match.$and = [];
    }
    if (body.min) {
      match.$and.push({ 'total': { $gte: body.min } });
    }
    if (body.max) {
      match.$and.push({ 'total': { $lte: body.max } });
    }
    if (body.start) {
      match.$and.push({ 'date': { $gte: moment(body.start).startOf('day').toDate() } });
    }
    if (body.end) {
      match.$and.push({ 'date': { $lte: moment(body.end).endOf('day').toDate() } });
    }
    match.user = new BSON.ObjectId(user._id);

    const aggr = [
      {
        '$group': {
          _id: '$category',
          sum: {
            $sum: '$total'
          }
        },
      },
      {
        '$lookup': {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        '$unwind': {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        '$sort': {
          'category.name': 1
        }
      }
    ];

    return [{ $match: match }, ...aggr]
  }

  static getDateAggregate(body: any, user: any) {

    const { date, statuses, page, sortBy } = body;
    const match: any = {
      user: new BSON.ObjectID(user._id),
      isDeleted: { $ne: true }
    };
    if (statuses && statuses.length) {
      match.status = { $in: statuses };
    }
    if (date && Array.isArray(date) && date.length === 2) {
      match.date = {
        $gte: moment(date[0]).toDate(),
        $lte: moment(date[1]).toDate()
      }
    }

    if (body.keyword) {
      let query: any = [
        { 'number': { $regex: body.keyword, $options: 'i' } }
      ];

      if (body.clients && body.clients.length) {
        query.push({ 'billTo': { $in: body.clients.map((id: any) => new BSON.ObjectID(id)) } })
      }
      match.$or = query
    }


    const sort = sortBy
      ? { '$sort': { [sortBy]: -1 } }
      : { '$sort': { 'date': -1 } };

    const aggr = [
      {
        '$lookup': {
          from: 'clients',
          localField: 'billTo',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        '$unwind': {
          path: '$client',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        ...sort,
      },
      {
        '$project': {
          'number': 1,
          'date': 1,
          'dueDate': 1,
          'paidDate': 1,
          'total': 1,
          'status': 1,
          'client.name': 1,
          'deposit': 1
        }
      },
    ];

    return [{ $match: match }, ...aggr]
  }

  static schema = {
    name: 'invoices',
    properties: {
      _id: 'objectId',
      token: {
        type: 'string?',
      },
      reference: {
        type: 'int?'
      },
      number: {
        type: 'string'
      },
      date: {
        type: 'date?'
      },
      dueDate: {
        type: 'date?'
      },
      paidDate: {
        type: 'date?'
      },
      recurringPeriod: {
        type: 'int?'
      },
      delivery: {
        type: '{}?',
      },
      items: {
        type: "InvoiceItem[]",
        default: []
      },
      customs: {
        type: "InvoiceCustom[]",
        default: []
      },
      note: {
        type: 'string?',
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
      deposit: {
        type: 'double?'
      },
      total: {
        type: 'double?'
      },
      attachments: {
        type: 'string[]',
        default: []
      },
      paypalId: {
        type: 'string?'
      },
      status: {
        type: 'string?',
        default: 'Estimate'
      },
      isDeleted: {
        type: 'bool',
        default: false
      },
      isExpense: {
        type: 'bool',
        default: false
      },
      billTo: {
        type: 'clients?',
      },
      signature: {
        type: 'signature?',
      },
      payments: {
        type: 'payments[]',
        default: []
      },
      category: {
        type: 'categories?',
      },
      user: {
        type: 'objectId?',
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

