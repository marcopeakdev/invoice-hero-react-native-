import React, {FC, memo} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {StyleSheet} from 'react-native';

type Props = {
  animatedProgress: Animated.SharedValue<number>;
};

export const Overlay: FC<Props> = memo(({animatedProgress}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedProgress.value,
      [-1, 0],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  return <Animated.View style={[styles.overlay, animatedStyle]} />;
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(107, 114, 128, 0.5)',
    opacity: 1,
  },
});
