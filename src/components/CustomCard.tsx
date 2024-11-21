import React from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { colors } from '../styles/colors';

type Props = {
  children: React.ReactNode;
  titleContainerStyle?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  titleStyle?: ViewStyle | ViewStyle[] | undefined;
  title?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  onPress?: () => void;
};

export const CustomCard: React.FC<Props> = ({ children, containerStyle, titleContainerStyle, contentContainerStyle, titleStyle, title, onPress }) => {
  let additionalStyles: ViewStyle[] = [];
  if (containerStyle) {
    if (Array.isArray(containerStyle)) {
      additionalStyles = [...containerStyle];
    } else {
      additionalStyles = [containerStyle];
    }
  }

  return (
    <View style={[styles.container, ...additionalStyles]}>
      <View style={[styles.titleContainer, titleContainerStyle]}>
        <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
      </View>
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: colors.whiteColor,
    shadowColor: 'rgba(6, 16, 45)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 5,
  },
  titleContainer: {
    backgroundColor: 'grey',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  titleStyle: {
    color: 'white',
  }
});
