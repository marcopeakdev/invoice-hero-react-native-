import React from 'react';
import Svg, {Path} from 'react-native-svg';
import { colors } from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const EstimateIcon: React.FC<Props> = ({size = 20, color = colors.gray}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <Path
        d="M11.1 4H4.10001C3.56957 4 3.06087 4.21071 2.68579 4.58579C2.31072 4.96086 2.10001 5.46957 2.10001 6V20C2.10001 20.5304 2.31072 21.0391 2.68579 21.4142C3.06087 21.7893 3.56957 22 4.10001 22H18.1C18.6304 22 19.1391 21.7893 19.5142 21.4142C19.8893 21.0391 20.1 20.5304 20.1 20V13"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.6 2.50023C18.9978 2.1024 19.5374 1.87891 20.1 1.87891C20.6626 1.87891 21.2022 2.1024 21.6 2.50023C21.9978 2.89805 22.2213 3.43762 22.2213 4.00023C22.2213 4.56284 21.9978 5.1024 21.6 5.50023L12.1 15.0002L8.10001 16.0002L9.10001 12.0002L18.6 2.50023Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
