import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

type Props = {
  size: number;
};

export const FacebookIcon: React.FC<Props> = ({ size }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G clipPath='url(#clip0_1024_9397)'>
        <Rect width={size} height={size} fill="#1877F2" />
        <Path
          fill="white"
          d="M20.0729 10.3101C20.0729 4.88504 15.675 0.48717 10.25 0.48717C4.82493 0.48717 0.427063 4.88504 0.427063 10.3101C0.427063 15.213 4.01916 19.2768 8.71515 20.0137V13.1495H6.22105V10.3101H8.71515V8.14598C8.71515 5.68411 10.1816 4.32425 12.4254 4.32425C13.5001 4.32425 14.6242 4.5161 14.6242 4.5161V6.93346H13.3856C12.1654 6.93346 11.7848 7.69065 11.7848 8.46746V10.3101H14.5091L14.0736 13.1495H11.7848V20.0137C16.4808 19.2768 20.0729 15.213 20.0729 10.3101Z"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1024_9397">
          <Rect width={size} height={size} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
