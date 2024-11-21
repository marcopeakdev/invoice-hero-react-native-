import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const ArrowDownIcon: React.FC<Props> = ({
  size = 24,
  color = colors.whiteColor,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 15L12 9L6 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
