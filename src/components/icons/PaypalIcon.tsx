import React from 'react';
import Svg, {Defs, G, Path, ClipPath, Rect} from 'react-native-svg';
import {colors} from '../../styles/colors';

type Props = {
  size?: number;
  color?: string;
};

export const PaypalIcon: React.FC<Props> = ({
  size = 24,
  color = colors.gray,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clip-path="url(#clip0_1024_9104)">
        <Path
          d="M7.76227 12.0932C7.76227 12.6017 7.35802 12.9887 6.84577 12.9887C6.46252 12.9887 6.17902 12.772 6.17902 12.364C6.17902 11.8555 6.57502 11.4475 7.08352 11.4475C7.47127 11.4475 7.76302 11.6852 7.76302 12.0932H7.76227ZM3.35377 10.0727H3.15802C3.09577 10.0727 3.03277 10.1147 3.02452 10.1852L2.84527 11.2982L3.18727 11.2855C3.64552 11.2855 3.99952 11.2232 4.08277 10.6937C4.17877 10.135 3.82477 10.0727 3.35377 10.0727ZM15.1873 10.0727H14.9998C14.9248 10.0727 14.8745 10.1147 14.8663 10.1852L14.6915 11.2982L15.0245 11.2855C15.566 11.2855 15.941 11.1602 15.941 10.5355C15.9365 10.0937 15.5413 10.0727 15.1865 10.0727H15.1873ZM23.9998 4.66822V19.3352C23.9996 19.8657 23.7888 20.3743 23.4137 20.7494C23.0386 21.1245 22.53 21.3353 21.9995 21.3355H1.99927C1.46883 21.3353 0.960179 21.1245 0.585103 20.7494C0.210026 20.3743 -0.000777785 19.8657 -0.000976562 19.3352V4.66822C-0.000777785 4.13778 0.210026 3.62912 0.585103 3.25405C0.960179 2.87897 1.46883 2.66817 1.99927 2.66797H21.9995C22.53 2.66817 23.0386 2.87897 23.4137 3.25405C23.7888 3.62912 23.9996 4.13778 23.9998 4.66822ZM5.34577 10.3097C5.34577 9.43447 4.67077 9.14272 3.89977 9.14272H2.23327C2.17944 9.14313 2.12763 9.16329 2.08767 9.19938C2.04772 9.23546 2.0224 9.28495 2.01652 9.33847L1.33327 13.5925C1.32052 13.6757 1.38352 13.759 1.46677 13.759H2.25877C2.37127 13.759 2.47552 13.6382 2.48827 13.5212L2.67577 12.4127C2.71777 12.1127 3.22552 12.217 3.42577 12.217C4.61752 12.217 5.34652 11.509 5.34652 10.309L5.34577 10.3097ZM8.85427 10.6765H8.06227C7.90402 10.6765 7.89577 10.906 7.88752 11.0185C7.64602 10.6645 7.29577 10.6015 6.89977 10.6015C5.87902 10.6015 5.09977 11.497 5.09977 12.4847C5.09977 13.297 5.60827 13.8265 6.42052 13.8265C6.79552 13.8265 7.26202 13.6225 7.52452 13.3307C7.50028 13.415 7.48618 13.5019 7.48252 13.5895C7.48252 13.6855 7.52452 13.756 7.61602 13.756H8.33302C8.44552 13.756 8.54152 13.6352 8.56252 13.5182L8.98777 10.8392C9.00052 10.7597 8.93752 10.6765 8.85427 10.6765ZM10.5418 14.7557L13.196 10.897C13.217 10.876 13.217 10.855 13.217 10.8265C13.217 10.756 13.1548 10.681 13.0835 10.681H12.2833C12.246 10.6824 12.2097 10.6926 12.1771 10.7107C12.1445 10.7289 12.1167 10.7544 12.0958 10.7852L10.9918 12.4105L10.5335 10.8482C10.5163 10.8007 10.4852 10.7594 10.4443 10.7298C10.4034 10.7001 10.3545 10.6833 10.304 10.6817H9.52477C9.45352 10.6817 9.39127 10.7567 9.39127 10.8272C9.39127 10.8775 10.2035 13.1942 10.2748 13.4147C10.1623 13.573 9.42052 14.6065 9.42052 14.7317C9.42052 14.8067 9.48277 14.8652 9.55402 14.8652H10.3543C10.3917 14.8628 10.4281 14.8517 10.4606 14.833C10.4931 14.8143 10.5209 14.7884 10.5418 14.7572V14.7557ZM17.1793 10.3097C17.1793 9.43447 16.5043 9.14272 15.7333 9.14272H14.0788C14.0234 9.14227 13.9697 9.16182 13.9275 9.19778C13.8853 9.23374 13.8576 9.28369 13.8493 9.33847L13.1743 13.5887C13.166 13.672 13.2283 13.7552 13.3078 13.7552H14.162C14.2453 13.7552 14.3075 13.693 14.3285 13.6217L14.516 12.4135C14.558 12.1135 15.0665 12.2177 15.266 12.2177C16.4495 12.2177 17.1785 11.5097 17.1785 10.3097H17.1793ZM20.687 10.6765H19.895C19.7368 10.6765 19.7285 10.906 19.7158 11.0185C19.4863 10.6645 19.1323 10.6015 18.728 10.6015C17.7073 10.6015 16.928 11.497 16.928 12.4847C16.928 13.297 17.4365 13.8265 18.2488 13.8265C18.6365 13.8265 19.103 13.6225 19.3528 13.3307C19.34 13.393 19.3108 13.5265 19.3108 13.5895C19.3108 13.6855 19.3528 13.756 19.4443 13.756H20.165C20.2775 13.756 20.3735 13.6352 20.3945 13.5182L20.8198 10.8392C20.8325 10.7597 20.7695 10.6765 20.6863 10.6765H20.687ZM22.6663 9.28897C22.6663 9.20572 22.604 9.14347 22.5328 9.14347H21.7618C21.6995 9.14347 21.6365 9.19372 21.6283 9.25597L20.9533 13.5895L20.9413 13.6105C20.9413 13.6855 21.0035 13.756 21.0868 13.756H21.7745C21.8788 13.756 21.983 13.6352 21.9913 13.5182L22.6663 9.30172V9.28897ZM18.9163 11.4475C18.4078 11.4475 18.0118 11.8517 18.0118 12.364C18.0118 12.7682 18.3035 12.9887 18.6868 12.9887C19.187 12.9887 19.5913 12.6055 19.5913 12.0932C19.5958 11.6852 19.304 11.4475 18.9163 11.4475Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1024_9104">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
