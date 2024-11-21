import React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const BusinessInfoIcon: React.FC<Props> = ({
  size = 24,
  color = '#6B7280',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 21C3.45 21 2.97933 20.8043 2.588 20.413C2.196 20.021 2 19.55 2 19V8C2 7.45 2.196 6.97933 2.588 6.588C2.97933 6.196 3.45 6 4 6H8V4C8 3.45 8.196 2.979 8.588 2.587C8.97933 2.19567 9.45 2 10 2H14C14.55 2 15.021 2.19567 15.413 2.587C15.8043 2.979 16 3.45 16 4V6H20C20.55 6 21.021 6.196 21.413 6.588C21.8043 6.97933 22 7.45 22 8V19C22 19.55 21.8043 20.021 21.413 20.413C21.021 20.8043 20.55 21 20 21H4ZM10 6H14V4H10V6ZM20 15H15V17H9V15H4V19H20V15ZM11 15H13V13H11V15ZM4 13H9V11H15V13H20V8H4V13Z"
        fill={color}
      />
    </Svg>
  );
};
