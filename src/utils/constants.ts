import {Platform} from 'react-native';

export const constants = {
  pageContainerBorderHeight: 30,
};

export const isIOS = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';
