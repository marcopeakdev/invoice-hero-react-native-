import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../styles/colors';
import {constants} from '../utils/constants';

type Props = {
  children: React.ReactNode;
  roundLeftTopBorder?: boolean;
};

export const PageContainer: React.FC<Props> = ({
  children,
  roundLeftTopBorder = true,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topRound,
          roundLeftTopBorder && {borderTopLeftRadius: 20},
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: colors.screenBackground,
    paddingBottom: 10,
  },
  topRound: {
    position: 'absolute',
    top: -constants.pageContainerBorderHeight + 4,
    left: 0,
    right: 0,
    height: constants.pageContainerBorderHeight,
    width: '100%',
    borderTopRightRadius: 20,
    backgroundColor: colors.screenBackground,
    zIndex: 1,
  },
});
