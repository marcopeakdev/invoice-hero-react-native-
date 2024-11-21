import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const BackArrowIcon: React.FC<Props> = ({
  size = 32,
  color = colors.whiteColor,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M2.97178 15.2376C2.97141 15.2379 2.97209 15.2372 2.97178 15.2376L8.41572 9.64515C8.82349 9.22627 9.48303 9.22783 9.88893 9.6488C10.2948 10.0697 10.2932 10.7505 9.88544 11.1694L6.231 14.9234H28.2917C28.867 14.9234 29.3334 15.4048 29.3334 15.9987C29.3334 16.5926 28.867 17.074 28.2917 17.074H6.23105L9.88539 20.8279C10.2932 21.2469 10.2947 21.9277 9.88887 22.3486C9.48298 22.7696 8.82339 22.7711 8.41567 22.3522L2.97266 16.7608C2.97303 16.7612 2.97235 16.7605 2.97266 16.7608C2.56469 16.3405 2.56505 15.6565 2.97178 15.2376Z"
        fill={color}
      />
    </Svg>
  );
};
