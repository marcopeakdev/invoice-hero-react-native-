import React from 'react';
import Svg, {Rect, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const CheckboxIcon: React.FC<Props> = ({size = 24}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        width="24"
        height="24"
        rx="4"
        fill="url(#paint0_linear_1024_10856)"
      />
      <Path
        d="M10.6 16.3206C10.4859 16.4354 10.3302 16.4995 10.1684 16.4995C10.0066 16.4995 9.85091 16.4354 9.73674 16.3206L6.28969 12.8729C5.93192 12.5152 5.93192 11.9352 6.28969 11.578L6.72133 11.1463C7.0791 10.7886 7.6585 10.7886 8.01627 11.1463L10.1684 13.2985L15.9837 7.48317C16.3414 7.1254 16.9215 7.1254 17.2786 7.48317L17.7103 7.91482C18.068 8.27259 18.068 8.85259 17.7103 9.20975L10.6 16.3206Z"
        fill="white"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1024_10856"
          x1="0"
          y1="0"
          x2="24"
          y2="22.2"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2D7AEA" />
          <Stop offset="1" stopColor="#6FABFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
