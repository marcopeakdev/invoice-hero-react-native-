import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../styles/colors';
import { FormField } from './FormField';

type Props = {
  setFieldValue: any;
  values: any;
};

export const SearchFilterAmount: React.FC<Props> = ({ setFieldValue, values }) => {
  return (
    <View style={styles.row}>
      <FormField label={'From'} containerStyle={styles.container}>
        <TextInput
          style={{ color: colors.text.darkGrayText }}
          value={values.min}
          keyboardType={'numeric'}
          onChangeText={val => setFieldValue('min', val)}
        />
      </FormField>
      <FormField label={'To'} containerStyle={styles.container}>
        <TextInput
          style={{ color: colors.text.darkGrayText }}
          value={values.max}
          keyboardType={'numeric'}
          onChangeText={val => setFieldValue('max', val)}
        />
      </FormField>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});
