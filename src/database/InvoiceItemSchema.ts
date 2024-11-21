export enum Priority {
  Severe = 0,
  High = 1,
  Medium = 2,
  Low = 3,
}


export class InvoiceItemSchema extends Realm.Object {
  rate?: number;
  hours?: number;
  description?: string;
  isDefault?: boolean;
  selected?: boolean;

  static generate(item: any) {
    return {
      ...item
    }
  }

  static schema = {
    name: 'InvoiceItem',
    embedded: true,
    properties: {
      rate: 'double?',
      hours: 'double?',
      description: 'string?',
      isDefault: 'bool?',
      selected: 'bool?',
    }
  };
}

