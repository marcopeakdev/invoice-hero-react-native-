import { createRealmContext } from '@realm/react';
import { AddressSchema } from './AddressSchema';
import { BusinessSchema } from './BusinessSchema';
import { CategorySchema } from './CategorySchema';
import { ClientSchema } from './ClientSchema';
import { InvoiceCustomSchema } from './InvoiceCustomSchema';
import { SignatureSchema } from './SignatureSchema';
import { InvoiceItemSchema } from './InvoiceItemSchema';
import { InvoiceSchema } from './InvoiceSchema';
import { ExpenseSchema } from './ExpenseSchema';
import { PaymentSchema } from './PaymentSchema';

export default createRealmContext({
  schema: [
    InvoiceSchema.schema,
    ExpenseSchema.schema,
    ClientSchema.schema,
    AddressSchema.schema,
    CategorySchema.schema,
    InvoiceItemSchema.schema,
    PaymentSchema.schema,
    InvoiceCustomSchema.schema,
    SignatureSchema.schema,
    BusinessSchema.schema
  ]
});
