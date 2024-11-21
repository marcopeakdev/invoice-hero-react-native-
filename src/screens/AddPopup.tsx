import React, { ElementRef, useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import BottomSheetCore from '@gorhom/bottom-sheet';
import { colors } from '../styles/colors';
import { Overlay } from '../components/Overlay';
import { BtnType, Button } from '../components/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { font } from '../styles/font';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export const AddPopup: React.FC<Props> = ({ navigation }) => {
  const animatedProgress = useSharedValue(-1);

  const bottomSheetRef = useRef<ElementRef<typeof BottomSheetCore>>(null);

  const closeBottomSheet = useCallback(
    () => bottomSheetRef.current?.close(),
    [],
  );

  const navigateTo = (route: MainStackRouteNames) => {
    navigation.replace(route);
  };

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={closeBottomSheet}
        style={StyleSheet.absoluteFillObject}>
        <Overlay animatedProgress={animatedProgress} />
      </Pressable>
      <BottomSheetCore
        ref={bottomSheetRef}
        snapPoints={[300]}
        animatedIndex={animatedProgress}
        onClose={onClose}
        enablePanDownToClose
        // handleComponent={hideHandle ? null : Handle}
        backgroundStyle={styles.bottomSheetBg}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Add new data</Text>
          <Button
            text={'Create Invoice'}
            type={BtnType.Primary}
            onPress={() => {
              navigation.replace(MainStackRouteNames.InvoiceSingle, {
                fromHomeTab: true,
              });
            }}
            containerStyle={styles.btn}
          />
          {/* <Button
            text={'Import Invoice'}
            type={BtnType.Outlined}
            onPress={() => navigateTo(MainStackRouteNames.InvoiceCreate)}
            containerStyle={styles.btn}
          /> */}
          <Button
            text={'Create Estimates'}
            type={BtnType.Outlined}
            onPress={() => {
              navigation.replace(MainStackRouteNames.InvoiceSingle, {
                estimate: true,
                fromHomeTab: true,
              });
            }}
            containerStyle={styles.btn}
          />
          <Button
            text={'Add Client'}
            type={BtnType.Outlined}
            onPress={() => navigateTo(MainStackRouteNames.ClientCreate)}
            containerStyle={styles.btn}
          />
        </View>
      </BottomSheetCore>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  title: {
    ...font(24, 36, '500'),
    color: colors.text.darkGrayText,
  },
  btn: {
    marginTop: 16,
  },
  bottomSheetBg: {
    backgroundColor: colors.screenBackground,
  },
});
