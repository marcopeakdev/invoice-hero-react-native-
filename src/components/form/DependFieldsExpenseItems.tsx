import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormField } from '../FormField';
import { commonView } from '../../styles/common';
import { useFormikContext } from 'formik';
import { CustomInputField } from './CustomInputField';

export const DependFieldsExpenseItems: React.FC = () => {
  const [discountToggleType, setDiscountToggleType] = useState(true);
  const [taxToggleType, setTaxToggleType] = useState(true);

  const {
    values: { items, subTotal, discount, tax, total },
    setFieldValue,
  } = useFormikContext<any>();

  useEffect(() => {
    const d = items.filter((a: any) => a.selected).reduce((a: number, c: any) => {
      let result = 0;

      if (c.rate && c.hours) {
        result = Number(c.rate) * Number(c.hours);
      }

      return a + result;
    }, 0);

    setFieldValue('subTotal', d);
  }, [items]);

  useEffect(() => {
    if (!subTotal) {
      setFieldValue('total', 0);
      return;
    }

    setFieldValue(
      'total',
      subTotal - (discount ? Number(discount) : 0) + (tax ? Number(tax) : 0),
    );
  }, [subTotal, discount, tax]);

  const onDiscountRateChanged = (val: string) => {
    if (val === '' || !subTotal) {
      setFieldValue('discount', '');
      return;
    }

    const result = Math.round(((subTotal * Number(val)) / 100) * 100) / 100;

    setFieldValue('discount', String(Number.isNaN(result) ? 0 : result));
  };

  const onDiscountChanged = (val: string) => {
    if (val === '' || !subTotal) {
      setFieldValue('discountRate', '');
      return;
    }

    const result = Math.round((Number(val) / subTotal) * 100 * 100) / 100;
    setFieldValue('discountRate', String(Number.isNaN(result) ? 0 : result));
  };

  const onTaxRateChanged = (val: string) => {
    const _total = subTotal - (Number(discount) || 0);
    const _tax = Math.round(((_total * Number(val)) / 100) * 100) / 100;

    setFieldValue('tax', String(_tax));
  };

  const onTaxChanged = (val: string) => {
    const _total = subTotal - (Number(discount) || 0);
    const _taxRate = Math.round((Number(val) / _total) * 100 * 100) / 100;

    setFieldValue('taxRate', String(_taxRate));
  };

  const onDiscountToggle = (status: boolean) => {
    setDiscountToggleType(status);
  };

  const onTaxToggle = (status: boolean) => {
    setTaxToggleType(status);
  };

  return (
    <View style={styles.container}>
      <FormField label={'Subtotal amount'} containerStyle={styles.field}>
        <Text style={commonView.cardRowValue}>${subTotal}</Text>
      </FormField>
      <CustomInputField
        inputIcon={discountToggleType ? <Text style={commonView.cardRowValue}>%</Text> : <Text style={commonView.cardRowValue}>$</Text>}
        keyboardType={'numeric'}
        label={'Discount'}
        name={discountToggleType ? 'discountRate' : 'discount'}
        onManualChange={discountToggleType? onDiscountRateChanged : onDiscountChanged}
        containerStyle={styles.field}
        onToggleType={onDiscountToggle}
        isChecked={true}
      />
      <CustomInputField
        inputIcon={taxToggleType ? <Text style={commonView.cardRowValue}>%</Text> : <Text style={commonView.cardRowValue}>$</Text>}
        keyboardType={'numeric'}
        label={'Tax'}
        name={taxToggleType ? 'taxRate' : 'tax'}
        onManualChange={taxToggleType ? onTaxRateChanged : onTaxChanged}
        containerStyle={styles.field}
        onToggleType={onTaxToggle}
        isChecked={true}
      />
      <FormField label={'Total amount'} containerStyle={styles.field}>
        <Text style={commonView.cardRowValue}>${total}</Text>
      </FormField>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  field: {
    marginBottom: 8,
  },
});
