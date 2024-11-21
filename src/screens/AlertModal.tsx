import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  BackHandler
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Overlay } from '../components/Overlay';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { font } from '../styles/font';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { commonText } from '../styles/common';
import { Button } from '../components/Button';
import { AuthRouterParamList } from '../navigation/AuthStackNavigator';


type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AlertModal>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AlertModal
  >;
};


export const AlertModal: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const animatedProgress = useSharedValue(-1);

  useEffect(() => {
    animatedProgress.value = withSpring(0);

    const backAction = () => {
      onClose()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedProgress.value,
      [-1, 0],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const onClose = () => {
    animatedProgress.value = withTiming(
      -1,
      {
        duration: 300,
      },
      canceled => {
        runOnJS(goBack)();
      },
    );
  };

  const goBack = () => {
    if (route.params?.callback) {
      route.params?.callback()
    }
    navigation.goBack();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <Overlay animatedProgress={animatedProgress} />
      </Pressable>
      <View
        style={[styles.modal,
        { top: insets.top + SCREEN_WIDTH * 0.6 }
        ]}>
        <View style={styles.topBlock}>
          <Text style={styles.titleBold}>
            {route.params?.title || 'NOTICE'}
          </Text>
        </View>
        <View style={styles.plansBlock}>
          <Text style={commonText.paragraphText}>
            {route.params?.message || ''}
          </Text>
        </View>
        <View style={styles.actionBlock}>
          <Button
            text={'Okay'}
            onPress={onClose}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0,
  },
  modal: {
    position: 'absolute',
    backgroundColor: colors.screenBackground,
    left: 24,
    right: 24,
    borderRadius: 15,
    padding: 25,
  },
  topBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plansBlock: {
    marginTop: 12,
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  },
  actionBlock: {
    flex: 1,
  },
  title: {
    ...font(20, 24, '400'),
    color: '#4c4c4c',
    textAlign: 'center',
  },
  titleBold: {
    ...font(20, 24, '500'),
    color: '#000',
  },
});
