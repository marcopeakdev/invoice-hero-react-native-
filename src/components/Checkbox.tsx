import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, gradients } from '../styles/colors';
import { CheckboxIcon } from './icons/Checkbox';

export enum CheckboxType {
  GreenPrimary = 'GreenPrimary',
  Primary = 'Primary',
  Secondary = 'Primary',
  Outlined = 'Outlined',
}

type Props = {
  type?: CheckboxType;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Checkbox: React.FC<Props> = ({ type = CheckboxType.Primary, label, checked = false, onChange }) => {
  const [state, setState] = useState(checked || false);

  const handleChange = () => {
    if (onChange) {
      onChange(!state);
    }
    setState(!state);
  }

  const getCheckbox = (t: string) => {
    switch (t) {
      default:
      case CheckboxType.Primary:
        return state ? (
          <LinearGradient
            {...gradients.mainBlueGradient}
            style={[
              styles.checboxContainer,
            ]}>
            <CheckboxIcon />
          </LinearGradient>
        ) : <View style={styles.emptyCheckbox}></View>;
      case CheckboxType.GreenPrimary:
        return (
          <View
            style={[
              styles.checboxContainer,
              styles.btnGreenPrimary,
            ]}>
            <CheckboxIcon />
          </View>
        );
      case CheckboxType.Secondary:
        return (
          <View
            style={[
              styles.checboxContainer,
              styles.btnOutlined,
            ]}>
            <CheckboxIcon />
          </View>
        );
    }
  }

  return (
    <TouchableOpacity
      onPress={handleChange}
      activeOpacity={0.8}>
      <View style={styles.container}>
        {getCheckbox(type)}
        {label && (
          <Text style={{ marginLeft: 5 }}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  checboxContainer: {
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  titleStyle: {
    color: 'white',
  },
  btnPrimary: {},
  btnGreenPrimary: {
    backgroundColor: colors.text.green
  },
  btnSecondary: {},
  btnOutlined: {
    borderWidth: 1,
    borderColor: colors.gray,
  },
  emptyCheckbox: {
    width: 24,
    height: 24,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 5,
  },
});
