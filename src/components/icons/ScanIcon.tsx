import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const ScanIcon: React.FC<Props> = ({ size = 20, color = colors.gray }) => {
  return (
    <Svg
      width={24}
      height={23}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M.8 4.8A4.8 4.8 0 0 1 5.6 0H8a.8.8 0 0 1 0 1.6H5.6a3.2 3.2 0 0 0-3.2 3.2v2.4a.8.8 0 0 1-1.6 0V4.8Zm14.4-4A.8.8 0 0 1 16 0h2.4a4.8 4.8 0 0 1 4.8 4.8v2.4a.8.8 0 0 1-1.6 0V4.8a3.2 3.2 0 0 0-3.2-3.2H16a.8.8 0 0 1-.8-.8ZM1.6 14.4a.8.8 0 0 1 .8.8v2.4a3.2 3.2 0 0 0 3.2 3.2H8a.8.8 0 0 1 0 1.6H5.6a4.8 4.8 0 0 1-4.8-4.8v-2.4a.8.8 0 0 1 .8-.8Zm20.8 0a.8.8 0 0 1 .8.8v2.4a4.8 4.8 0 0 1-4.8 4.8H16a.8.8 0 1 1 0-1.6h2.4a3.2 3.2 0 0 0 3.2-3.2v-2.4a.8.8 0 0 1 .8-.8ZM12 12.8a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Zm-6.4 1.6V9.6A1.6 1.6 0 0 1 7.2 8h1.6l1.125-1.688a1.6 1.6 0 0 1 1.331-.712h1.488a1.6 1.6 0 0 1 1.331.712L15.2 8h1.6a1.6 1.6 0 0 1 1.6 1.6v4.8a1.6 1.6 0 0 1-1.6 1.6H7.2a1.6 1.6 0 0 1-1.6-1.6Zm9.6-3.2a3.2 3.2 0 1 0-6.4 0 3.2 3.2 0 0 0 6.4 0Z"
        fill={color}
      />
    </Svg>
  );
};
