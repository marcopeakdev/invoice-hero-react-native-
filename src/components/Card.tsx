import React from 'react';
import {StyleSheet, View, ViewStyle, TouchableOpacity} from 'react-native';
import {colors} from '../styles/colors';

type Props = {
  children: React.ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
  onPress?: () => void;
};

export const Card: React.FC<Props> = ({children, containerStyle, onPress}) => {
  let additionalStyles: ViewStyle[] = [];
  if (containerStyle) {
    if (Array.isArray(containerStyle)) {
      additionalStyles = [...containerStyle];
    } else {
      additionalStyles = [containerStyle];
    }
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.container, ...additionalStyles]}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, ...additionalStyles]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 4,
    backgroundColor: colors.whiteColor,
    shadowColor: 'rgba(6, 16, 45)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
});
