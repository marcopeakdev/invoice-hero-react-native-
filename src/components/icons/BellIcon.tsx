import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const BellIcon: React.FC<Props> = ({
  size = 16,
  color = colors.whiteColor,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12 5.33398C12 4.27312 11.5786 3.2557 10.8284 2.50556C10.0783 1.75541 9.06087 1.33398 8 1.33398C6.93913 1.33398 5.92172 1.75541 5.17157 2.50556C4.42143 3.2557 4 4.27312 4 5.33398C4 10.0007 2 11.334 2 11.334H14C14 11.334 12 10.0007 12 5.33398Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.15332 14C9.03612 14.2021 8.86788 14.3698 8.66547 14.4864C8.46306 14.6029 8.23358 14.6643 7.99999 14.6643C7.7664 14.6643 7.53692 14.6029 7.33451 14.4864C7.13209 14.3698 6.96386 14.2021 6.84666 14"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
