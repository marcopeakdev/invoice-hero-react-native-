import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/colors';
import {font} from '../styles/font';
import { NoExpense } from './icons/NoExpense';

type Props = {
  title?: string;
  description?: string;
};

export const EmptyExpense: React.FC<Props> = ({title, description}) => {
  return (
    <View style={styles.container}>
      <NoExpense />
      <Text style={styles.text}>{title || 'No Available Expense'}</Text>
      {Boolean(description) && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...font(16, 18, '400'),
    marginTop: 24,
    color: colors.text.dark,
  },
  description: {
    marginTop: 12,
    textAlign: 'center',
    ...font(18, 18, '900'),
    paddingHorizontal: 24,
    color: colors.text.grayText,
  },
});
