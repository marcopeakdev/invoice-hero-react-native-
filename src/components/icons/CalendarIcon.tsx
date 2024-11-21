import React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const CalendarIcon: React.FC<Props> = ({
  size = 24,
  color = '#757575',
}) => {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 24 24">
      <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </Svg>
  );
};
