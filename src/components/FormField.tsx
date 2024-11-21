import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Card } from './Card';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

type Props = {
  label?: string;
  isClickable?: boolean;
  children: React.ReactNode;
  cardFooter?: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  cardStyle?: ViewStyle | ViewStyle[];
  onPress?: () => void;
};

export const FormField: React.FC<Props> = ({
  label,
  children,
  cardFooter,
  containerStyle,
  cardStyle,
  labelStyle,
  isClickable,
  onPress,
}) => {
  let cardContainerStyle: any = [];
  if (cardStyle) {
    if (Array.isArray(cardStyle)) {
      cardContainerStyle = cardStyle;
    } else {
      cardContainerStyle = [cardStyle];
    }
  }
  return (
    <View style={Boolean(containerStyle) && containerStyle}>
      {Boolean(label) && (
        <Text style={[styles.label, Boolean(labelStyle) && labelStyle]}>
          {label}
        </Text>
      )}
      <Card containerStyle={[styles.cardContainerStyle, ...cardContainerStyle]} onPress={onPress}>
        {children && (
          <View style={styles.rowStyle}>
            <View style={[styles.cardStyle, ...cardContainerStyle, styles.borderStyle]}>
              {children}
            </View>
            {isClickable && (
              <View style={{ width: 30, marginRight: 10 }}>
                <ChevronRightIcon />
              </View>
            )}
          </View>
        )}
        {cardFooter && (
          <View>
            {cardFooter}
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...font(16, 24),
    marginBottom: 8,
    paddingHorizontal: 24,
    color: colors.text.grayText,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
    paddingRight: 28,
  },
  cardContainerStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cardStyle: {
    width: '100%',
  },
  borderStyle: {
    borderWidth: 0,
  }
});
