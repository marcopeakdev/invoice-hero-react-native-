export enum Priority {
  Severe = 0,
  High = 1,
  Medium = 2,
  Low = 3,
}


export class InvoiceCustomSchema extends Realm.Object {
  name?: string;
  description?: string;

  static generate(item: any) {
    return {
      ...item
    }
  }

  static schema = {
    name: 'InvoiceCustom',
    embedded: true,
    properties: {
      name: 'string?',
      description: 'string?',
    }
  };
}

