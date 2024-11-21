import React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  size: number;
  color: string;
};

export const InvoicesIcon: React.FC<Props> = ({size, color}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <Path
        d="M13.9 2H6.89999C6.36956 2 5.86085 2.21071 5.48578 2.58579C5.11071 2.96086 4.89999 3.46957 4.89999 4V20C4.89999 20.5304 5.11071 21.0391 5.48578 21.4142C5.86085 21.7893 6.36956 22 6.89999 22H18.9C19.4304 22 19.9391 21.7893 20.3142 21.4142C20.6893 21.0391 20.9 20.5304 20.9 20V9L13.9 2Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.9 2V9H20.9"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
