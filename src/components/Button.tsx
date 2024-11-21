import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextStyle,
} from 'react-native';
import {colors, gradients} from '../styles/colors';
import {font} from '../styles/font';
import LinearGradient from 'react-native-linear-gradient';

export enum BtnType {
  GreenPrimary = 'GreenPrimary',
  Primary = 'Primary',
  Secondary = 'Primary',
  Outlined = 'Outlined',
}

type Props = {
  text: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  onPress: () => void;
  type?: BtnType;
  disabled?: boolean;
  loading?: boolean;
};

export const Button: React.FC<Props> = ({
  text,
  icon,
  containerStyle,
  onPress,
  type = BtnType.Primary,
  disabled = false,
  loading,
}) => {
  const buttonText = (btnType: BtnType) => {
    if (loading) {
      return <ActivityIndicator size={'small'} color={'#fff'} />;
    }

    let additionalTextStyle: TextStyle;

    switch (btnType) {
      default:
      case BtnType.Primary:
        additionalTextStyle = styles.btnPrimaryText;
        break;
      case BtnType.GreenPrimary:
        additionalTextStyle = styles.btnGreenText;
        break;
      case BtnType.Secondary:
      case BtnType.Outlined:
        additionalTextStyle = styles.btnOutlinedText;
        break;
    }

    return (
      <>
        {Boolean(icon) && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.btnText, additionalTextStyle]}>{text}</Text>
      </>
    );
  };

  const getButton = (t: BtnType) => {
    switch (t) {
      default:
      case BtnType.Primary:
        return (
          <LinearGradient
            {...gradients.mainBlueGradient}
            style={[
              styles.container,
              Boolean(containerStyle) && containerStyle,
            ]}>
            {buttonText(t)}
          </LinearGradient>
        );
        case BtnType.GreenPrimary:
        return (
          <View
            style={[
              styles.container,
              styles.btnGreenPrimary,
              Boolean(containerStyle) && containerStyle,
            ]}>
            {buttonText(t)}
          </View>
        );
      case BtnType.Secondary:
        return (
          <View
            style={[
              styles.container,
              styles.btnOutlined,
              Boolean(containerStyle) && containerStyle,
            ]}>
            {buttonText(t)}
          </View>
        );
      case BtnType.Outlined:
        return (
          <View
            style={[
              styles.container,
              styles.btnOutlined,
              Boolean(containerStyle) && containerStyle,
            ]}>
            {buttonText(t)}
          </View>
        );
    }
  };

  if (disabled) {
    return <View style={{opacity: 0.6}}>{getButton(type)}</View>;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (!loading) {
          onPress();
        }
      }}
      activeOpacity={0.8}>
      {getButton(type)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...font(14, 18, '500'),
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
  btnPrimaryText: {
    color: colors.text.whiteText,
  },
  btnGreenText: {
    color: colors.text.whiteText,
  },
  btnSecondaryText: {},
  btnOutlinedText: {
    color: colors.text.grayText,
  },
  iconContainer: {
    marginRight: 6,
  },
});
