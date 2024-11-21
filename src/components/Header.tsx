import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../styles/colors';
import { StyleSheet } from 'react-native';
import { constants } from '../utils/constants';
import { HeaderTitle } from './HeaderTitle';

type Props = {
  title: string;
  children?: React.ReactNode;
  showBackBtn?: boolean;
  showCloseBtn?: boolean;
  rightSideComponent?: React.ReactNode;
  onBackPress?: any;
};

export const Header: React.FC<Props> = ({
  title,
  showBackBtn,
  showCloseBtn,
  children = null,
  rightSideComponent,
  onBackPress
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      {...gradients.mainBlueGradient}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: constants.pageContainerBorderHeight,
        },
      ]}>
      <HeaderTitle
        title={title}
        showBackBtn={showBackBtn}
        showCloseBtn={showCloseBtn}
        rightSideComponent={rightSideComponent}
        onBackPress={onBackPress}
      />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {},
});
