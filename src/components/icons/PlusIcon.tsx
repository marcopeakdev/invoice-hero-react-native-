import React from 'react';
import Svg, {Path} from 'react-native-svg';
import { colors } from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const PlusIcon: React.FC<Props> = ({size = 20, color = colors.gray}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 31 31" fill="none">
      <Path
        d="M15.5 2V29"
        stroke={color}
        strokeWidth="3.19737"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 15.5H29"
        stroke={color}
        strokeWidth="3.19737"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
