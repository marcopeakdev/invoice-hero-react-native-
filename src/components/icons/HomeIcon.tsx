import React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  size: number;
  color: string;
};

export const HomeIcon: React.FC<Props> = ({size, color}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <Path
        d="M3.3 9L12.3 2L21.3 9V20C21.3 20.5304 21.0893 21.0391 20.7142 21.4142C20.3391 21.7893 19.8304 22 19.3 22H5.3C4.76957 22 4.26086 21.7893 3.88579 21.4142C3.51071 21.0391 3.3 20.5304 3.3 20V9Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.3 22V12H15.3V22"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
