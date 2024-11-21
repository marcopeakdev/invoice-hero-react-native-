import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const CheckMarkIcon: React.FC<Props> = ({ size = 24, color = '#fff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        fill={color}
        class={"color000000 svgShape"}
      >
        <G
          fill={color}
          class={"color000000 svgShape"}
        >
          <Path
            d="M9.71 11.29a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 16a1 1 0 0 0 .72-.34l7-8a1 1 0 0 0-1.5-1.32L12 13.54z"
            stroke={color}
            strokeWidth="0.1"
          />
          <Path
            d="M21 11a1 1 0 0 0-1 1 8 8 0 0 1-8 8A8 8 0 0 1 6.33 6.36 7.93 7.93 0 0 1 12 4a8.79 8.79 0 0 1 1.9.22 1 1 0 1 0 .47-1.94A10.54 10.54 0 0 0 12 2a10 10 0 0 0-7 17.09A9.93 9.93 0 0 0 12 22a10 10 0 0 0 10-10 1 1 0 0 0-1-1z"
            stroke={color}
            strokeWidth="0.11"
          />
        </G>
      </G>
    </Svg>
  );
};
