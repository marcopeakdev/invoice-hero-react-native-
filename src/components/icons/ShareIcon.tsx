import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const ShareIcon: React.FC<Props> = ({ size = 24, color = '#6B7280' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        fill={'none'}
        fillRule='evenodd'
        stroke={color}
        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(1 1)"
      >
        <Circle
          cx={15} cy={3} r={3}
        />
        <Circle
          cx={3} cy={10} r={3}
        />
        <Circle
          cx={15} cy={17} r={3}
        />
        <Path
          d="m5.59 11.51 6.83 3.98M12.41 4.51 5.59 8.49"
        />
      </G>
    </Svg>
  );
};
