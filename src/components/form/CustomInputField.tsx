import React, { useState } from 'react';
import { commonInput } from '../../styles/common';
import { KeyboardType, StyleSheet, Text, TextInput, TextInputProps, ViewStyle, View, Switch } from 'react-native';
import { FormField } from '../FormField';
import { useField } from 'formik';
import { colors } from '../../styles/colors';
import { font } from '../../styles/font';

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
  onToggleType?: (val: boolean) => void;
  textInputProps?: TextInputProps
  isChecked?: boolean;
};

export const CustomInputField: React.FC<Props> = ({
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
  onToggleType,
  keyboardType = 'default',
  textInputProps,
  isChecked,
}) => {
  const [isEnabled, setEnabled] = useState(isChecked || false);
  const [field, meta, helpers] = useField(name);

  const toggleSwitch = () => {
    setEnabled(!isEnabled);
    if (onToggleType) {
      onToggleType(!isEnabled);
    }
  }

  return (
    <View>
      <View style={styles.rowStyle}>
        <Text style={styles.labelStyle}>{label}</Text>
        <View style={styles.rightStyle}>
          <Text>$</Text>
          <Switch
            trackColor={{ false: "rgba(45, 122, 234, 0.1)", true: "rgba(45, 122, 234, 0.1)" }}
            thumbColor={"rgba(45, 122, 234, 1)"}
            ios_backgroundColor="rgba(45, 122, 234, 0.1)"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text>%</Text>
        </View>
      </View>
      <FormField
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
          style={{ ...commonInput.input, ...inputStyle }}
          keyboardType={keyboardType}
          {...textInputProps}
        />
      </FormField>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  rightStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingRight: 10,
  },
  labelStyle: {
    ...font(16, 24),
    marginBottom: 8,
    paddingHorizontal: 5,
    color: colors.text.grayText,
  }
});
