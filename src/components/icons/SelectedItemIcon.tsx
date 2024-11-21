import React from 'react';
import Svg, {LinearGradient, Circle, Defs, Stop} from 'react-native-svg';

type Props = {
  size?: number;
  selected: boolean;
};

export const SelectedItemIcon: React.FC<Props> = ({size = 24, selected}) => {
  if (selected) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#paint0_linear_1024_9173)"
          strokeWidth="1.6"
        />
        <Circle cx="12" cy="12" r="6" fill="url(#paint1_linear_1024_9173)" />
        <Defs>
          <LinearGradient
            id="paint0_linear_1024_9173"
            x1="2"
            y1="2"
            x2="22"
            y2="20.5"
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#2D7AEA" />
            <Stop offset="1" stopColor="#6FABFF" />
          </LinearGradient>
          <LinearGradient
            id="paint1_linear_1024_9173"
            x1="6"
            y1="6"
            x2="18"
            y2="17.1"
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#2D7AEA" />
            <Stop offset="1" stopColor="#6FABFF" />
          </LinearGradient>
        </Defs>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#paint0_linear_1024_9195)"
        strokeWidth="1.6"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1024_9195"
          x1="2"
          y1="2"
          x2="22"
          y2="20.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2D7AEA" />
          <Stop offset="1" stopColor="#6FABFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
