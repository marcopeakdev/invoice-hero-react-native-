import React from 'react';
import Svg, {Rect} from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const EmptyCheckboxIcon: React.FC<Props> = ({
  size = 24,
  color = '#D1D5DB',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke={color} />
    </Svg>
  );
};
