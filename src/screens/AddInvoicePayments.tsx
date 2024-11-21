import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainStackRouteNames} from '../navigation/router-names';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {BtnType, Button} from '../components/Button';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {selectPayments} from '../store/selectors/payments';
import {PaymentType} from '../models/payment';
import {Card} from '../components/Card';
import {colors} from '../styles/colors';
import ToggleSwitch from 'toggle-switch-react-native';
import {toggleArrayItem} from '../utils/array.tools';
import {PaypalIcon} from '../components/icons/PaypalIcon';
import {font} from '../styles/font';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoicePayments>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddInvoicePayments
  >;
};

export const AddInvoicePayments: React.FC<Props> = ({route, navigation}) => {
  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  const payments = useSelector(selectPayments);

  const [values, setValues] = useState<string[]>(route.params?.value || []);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }
  }, [route]);

  const cashPayments = useMemo(() => {
    return payments.filter(payment => payment.type === PaymentType.Cash);
  }, [payments]);

  const creditPayments = useMemo(() => {
    return payments.filter(payment => payment.type === PaymentType.Credit);
  }, [payments]);

  const checkingPayments = useMemo(() => {
    return payments.filter(payment => payment.type === PaymentType.Checking);
  }, [payments]);

  const customPayments = useMemo(() => {
    return payments.filter(payment => payment.type === PaymentType.Custom);
  }, [payments]);

  const togglePayment = (paymentId: string) => {
    setValues(state => [...toggleArrayItem<string>(state, paymentId)]);
  };

  const getPaymentIcon = (paymentName: string) => {
    switch (paymentName) {
      case 'Paypal':
        return <PaypalIcon />;
      default:
        break;
    }
  };

  const onSave = () => {
    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: values,
    });
  };

  const onCancel = () => {
    navigation.navigate<any>(backScreen.current);
  };

  return (
    <View style={styles.container}>
      <Header title={'Add Payment Methods'} showBackBtn={true} />
      <PageContainer>
        <ScrollView style={styles.container}>
          {cashPayments.length && (
            <>
              <Text style={styles.paymentBlockTitle}>Cash Payments</Text>
              {cashPayments.map(payment => {
                return (
                  <Card key={payment.name} containerStyle={styles.field}>
                    <View style={styles.paymentContainer}>
                      <>
                        {getPaymentIcon(payment.name)}
                        <Text style={styles.paymentName}>{payment.name}</Text>
                        <ToggleSwitch
                          size={'small'}
                          isOn={values.includes(payment._id)}
                          onToggle={() => togglePayment(payment._id)}
                          trackOnStyle={{
                            backgroundColor: '#5799F8',
                          }}
                        />
                      </>
                    </View>
                  </Card>
                );
              })}
            </>
          )}
        </ScrollView>
        <View style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
          <Button
            text={'Save'}
            containerStyle={styles.action}
            onPress={() => onSave()}
          />
          <Button
            text={'Cancel'}
            type={BtnType.Outlined}
            containerStyle={styles.action}
            onPress={onCancel}
          />
        </View>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    paddingHorizontal: 24,
  },
  action: {
    marginTop: 16,
  },
  paymentBlockTitle: {
    ...font(16, 24),
    color: colors.text.grayText,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentName: {
    flex: 1,
    ...font(14,21),
    color: colors.text.grayText,
    marginLeft: 16,
  },
  field: {
    marginBottom: 16,
  },
});
