import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const LogoutIcon: React.FC<Props> = ({
  size = 24,
  color = colors.bluePrimary,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M9.99585 1H1V19H10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 14.5L19 10L14.5 5.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 9.99609H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
