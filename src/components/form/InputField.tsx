import React from 'react';
import {commonInput} from '../../styles/common';
import {KeyboardType, StyleSheet, Text, TextInput, TextInputProps, ViewStyle} from 'react-native';
import {FormField} from '../FormField';
import {useField} from 'formik';
import { colors } from '../../styles/colors';

type Props = {
  label?: string;
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  keyboardType?: KeyboardType;
  onManualChange?: (val: string) => void;
  textInputProps?: TextInputProps
};

export const InputField: React.FC<Props> = ({
  label,
  name,
  secureTextEntry = false,
  containerStyle = {},
  inputIcon,
  cardStyle,
  labelStyle,
  inputStyle,
  placeholder,
  onManualChange,
  keyboardType = 'default',
  textInputProps
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <FormField
      label={label}
      containerStyle={{
        ...styles.field,
        ...containerStyle,
      }}
      labelStyle={labelStyle}
      cardStyle={[
        commonInput.container,
        meta.touched && meta.error ? commonInput.containerError : {},
        cardStyle ? cardStyle : {},
      ]}>
      {Boolean(inputIcon) && inputIcon}
      <TextInput
        secureTextEntry={secureTextEntry}
        onChangeText={val => {
          helpers.setValue(val);
          if (onManualChange) {
            onManualChange(val);
          }
        }}
        placeholder={placeholder || ''}
        placeholderTextColor={colors.lightGray}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        style={{...commonInput.input, ...inputStyle}}
        keyboardType={keyboardType}
        {...textInputProps}
      />
    </FormField>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
});
