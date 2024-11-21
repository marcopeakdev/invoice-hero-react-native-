export class SignatureSchema extends Realm.Object {
  uri?: string;

  static generate(item: any) {
    return {
      ...item
    }
  }

  static schema = {
    name: 'signature',
    embedded: true,
    properties: {
      uri: 'string?',
      createdAt: 'date?',
    }
  };
}

