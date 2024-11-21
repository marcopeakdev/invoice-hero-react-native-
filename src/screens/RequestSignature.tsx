import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MainStackRouteNames } from '../navigation/router-names';
import { StyleSheet, View, Image } from 'react-native';
import SignatureScreen from "react-native-signature-canvas";
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { Button } from '../components/Button';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectBusiness } from '../store/selectors/business';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.RequestSignature>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.RequestSignature
  >;
};

export const RequestSignature: React.FC<Props> = ({ route, navigation }) => {
  const business = useSelector(selectBusiness);

  const ref = useRef<any>();
  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);
  const invoiceId = useRef<string | null>(null);
  const invoiceNumber = useRef<string | null>(null);

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.invoiceId) {
      invoiceId.current = route.params?.invoiceId;
    }

    if (route.params?.invoiceNumber) {
      invoiceNumber.current = route.params?.invoiceNumber;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }
  }, [route]);

  const onSave = (signature: any): void => {
    if (route.params.callback) {
      route.params.callback({
        [returnValueName.current!]: signature,
      })
      navigation.goBack()
      return;
    }

    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: signature,
    });
  };

  const handleOK = (signature: any): void => {
    const dateObj = new Date();
    const dateVal = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();
    
    onSave({
      uri: signature,
      createdAt: dateVal,
    });
  };

  const handleClear = (): void => {
    ref.current.clearSignature();
    onSave(null);
  };

  const handleConfirm = (): void => {
    console.log("end");
    ref.current.readSignature();
  };
  
  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;
  return (
    <View style={styles.container}>
      <Header
        title={'Add Signature'}
        showBackBtn={true}
      />
      <PageContainer>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
        >
          <View style={styles.pageContainer}>
            <View style={styles.signaturePad}>
              <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} dataURL={route.params?.value?.uri} />
            </View>
            <View style={styles.row}>
              <Button text="Clear" onPress={handleClear} containerStyle={styles.btn} />
              <Button text="Confirm" onPress={handleConfirm} containerStyle={styles.btn} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotsContainer: {
    width: 24,
    height: 24,
  },
  pageContainer: {
    padding: 5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  signaturePad: {
    height: 250, 
    width: '99%',
    borderWidth: 0.5,
    borderColor: 'lightgrey'
  },
  btn: {
    width: 100,
  }
});
