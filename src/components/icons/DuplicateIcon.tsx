import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const DuplicateIcon: React.FC<Props> = ({ size = 24, color = '#6B7280' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 21.5H3A1.5 1.5 0 0 1 1.5 20V7A1.5 1.5 0 0 1 3 5.5h13A1.5 1.5 0 0 1 17.5 7v13a1.5 1.5 0 0 1-1.5 1.5z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
      <G
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        fill="none"
        stroke={color}
      >
        <Path
          d='M8 2.5h1'
        />
        <Path
          strokeDasharray={[2.2, 2.2]}
          d="M11.2 2.5h7.7"
        />
        <Path
          d='M8 2.5h1'
        />
      </G>
      <G
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        fill="none"
        stroke={color}
      >
        <Path
          d='M22.5 4v1'
        />
        <Path
          strokeDasharray={[2.2, 2.2]}
          d="M22.5 7.2v7.7"
        />
        <Path
          d='M22.5 16v1'
        />
      </G>
      <Path
        d="M4.5 10.5h10M4.5 13.5h10M4.5 16.5h10M19.5 7.5h-2M19.5 10.5h-2M19.5 13.5h-2M22.5 4c0-.83-.67-1.5-1.5-1.5M8 2.5c-.83 0-1.5.67-1.5 1.5v1.5M20 18.5h1c.83 0 1.5-.67 1.5-1.5M17.78 18.5h-.28"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </Svg>
  );
};
