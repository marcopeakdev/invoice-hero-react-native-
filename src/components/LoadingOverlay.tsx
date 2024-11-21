import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

type Props = {
  visible: Boolean,
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const LoadingOverlay: React.FC<Props> = ({ visible }) => {
  
  if (!visible) {
    return (<></>);
  }

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width,
    height,
  }
})