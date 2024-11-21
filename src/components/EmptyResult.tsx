import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SadSmile} from './icons/SadSmile';
import {colors} from '../styles/colors';
import {font} from '../styles/font';

type Props = {
  title?: string;
  description?: string;
};

export const EmptyResult: React.FC<Props> = ({title, description}) => {
  return (
    <View style={styles.container}>
      <SadSmile />
      <Text style={styles.text}>{title || 'Empty result'}</Text>
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
    ...font(16, 18, '600'),
    marginTop: 24,
    color: colors.text.dark,
  },
  description: {
    marginTop: 12,
    textAlign: 'center',
    ...font(14, 16),
    paddingHorizontal: 24,
    color: colors.text.grayText,
  },
});
