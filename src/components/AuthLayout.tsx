import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors, gradients} from '../styles/colors';
import {font} from '../styles/font';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {constants} from '../utils/constants';
import {Images} from '../assets/images';

type Props = {
  children: React.ReactNode;
};

export const AuthLayout: React.FC<Props> = ({children}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={true}
        viewIsInsideTabBar={true}>
        <LinearGradient
          {...gradients.mainBlueGradient}
          style={[styles.topBlock, {paddingTop: insets.top + 165}]}>
          <Text style={styles.topBlockTitle}>Invoice APP</Text>
          <Image
            source={Images.authImage}
            style={[styles.authImage, {top: insets.top + 20}]}
            resizeMode="center"
          />
        </LinearGradient>
        <View style={[styles.mainBlock, {paddingBottom: insets.bottom + 10}]}>
          <View style={styles.topRound} />
          {children}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topBlock: {
    flex: 1,
    paddingBottom: constants.pageContainerBorderHeight,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topBlockTitle: {
    ...font(26, 28, '600'),
    color: colors.text.whiteText,
    textTransform: 'uppercase',
    marginBottom: 37,
  },
  authImage: {
    position: 'absolute',
    width: 140,
    left: '50%',
    transform: [{translateX: -140 / 2}],
  },
  mainBlock: {
    position: 'relative',
    backgroundColor: colors.screenBackground,
  },
  topRound: {
    position: 'absolute',
    top: -constants.pageContainerBorderHeight,
    left: 0,
    right: 0,
    height: constants.pageContainerBorderHeight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.screenBackground,
  },
});
