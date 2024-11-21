import React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  color: string;
};

export const InvoicesCorner: React.FC<Props> = ({color}) => {
  return (
    <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
      <Path
        d="M1 15V0C1 11.6 11 14.8333 16 15H1Z"
        fill={color}
        stroke={color}
        strokeWidth="0.1"
      />
    </Svg>
  );
};
