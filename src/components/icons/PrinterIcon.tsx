import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const PrinterIcon: React.FC<Props> = ({ size = 24, color = '#6B7280' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        stroke={color}
        d="M7,10a1,1,0,1,0,1,1A1,1,0,0,0,7,10ZM19,6H18V3a1,1,0,0,0-1-1H7A1,1,0,0,0,6,3V6H5A3,3,0,0,0,2,9v6a3,3,0,0,0,3,3H6v3a1,1,0,0,0,1,1H17a1,1,0,0,0,1-1V18h1a3,3,0,0,0,3-3V9A3,3,0,0,0,19,6ZM8,4h8V6H8Zm8,16H8V16h8Zm4-5a1,1,0,0,1-1,1H18V15a1,1,0,0,0-1-1H7a1,1,0,0,0-1,1v1H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8H19a1,1,0,0,1,1,1Z" />
    </Svg>
  );
};
