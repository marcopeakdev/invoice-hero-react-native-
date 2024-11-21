import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { MainStackRouteNames } from '../navigation/router-names';
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { BtnType, Button } from '../components/Button';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InputField } from '../components/form/InputField';
import { Card } from '../components/Card';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import ToggleSwitch from 'toggle-switch-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectPayments } from '../store/selectors/payments';
import { PaymentType } from '../models/payment';
import { Images } from '../assets/images';
import { toggleArrayObject } from '../utils/array.tools';
import { commonText } from '../styles/common';
import { DotsIcon } from '../components/icons/DotsIcon';
import { selectBusiness } from '../store/selectors/business';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';
import { Business } from '../models/business';
import { selectUser } from '../store/selectors/user';
import SafariView from 'react-native-safari-view';
import { showMessage } from 'react-native-flash-message';
import { api, ApiRequestEnum } from '../utils/api';
import { getUser } from '../store/thunk/user';
import { requestCardPaymentInvoice, requestPaymentMerchantInvoice } from '../store/thunk/invoices';
import { Invoice } from '../models/invoice';

const { useObject, useRealm } = RealmContext;

const CARD_PAYMENT_URL = 'https://invoicehero.securepayments.cardpointe.com/pay?';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.RequestPayment>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.RequestPayment
  >;
};

export const RequestPayment: React.FC<Props> = ({ route, navigation }) => {
  const business = useSelector(selectBusiness);

  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);
  const invoiceId = useRef<string | null>(null);
  const invoiceNumber = useRef<string | null>(null);
  const dispatch = useDispatch<any>();
  const form = useRef<any>()

  const realm = useRealm();
  const businessObj = useObject('businesses', new BSON.ObjectID(business.result?._id));
  const formatedInvoice = useObject<Invoice>('invoices', route.params?.invoiceId);

  const [isDefaultMessage, setIsDefaultMessage] = useState(route.params.value.isDefaultMessage || false)
  const [values, setValues] = useState<any[]>(route.params?.payments || []);
  const [showDotsPopup, setShowDotsPopup] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const insets = useSafeAreaInsets();

  const payments = useSelector(selectPayments);
  const user = useSelector(selectUser);
  const [onlinePaymentsState, setOnlinePaymentsState] = useState(user?.isEnableOnlinePayment ? true : false);

  const onlinePayments = useMemo(() => {
    // const filteredPayments = payments.filter(payment => payment.type === PaymentType.OnlineCashPayments || payment.type === PaymentType.OnlinePayments);
    const filteredPayments = payments.filter(payment => payment.type === PaymentType.OnlineCashPayments || payment.type === PaymentType.CardPayments);
    // console.log(filteredPayments);
    // const isExist = values.find((item) => item._id === filteredPayments[0]._id);
    // if (!isExist) {
    //   setValues(state => [...toggleArrayObject<any>(state, filteredPayments[0])]);
    // }
    return filteredPayments;
  }, [payments]);

  const isOnlinePayments = useMemo(() => {
    // return values.map(item => item?._id).includes('6318cd39e7947801394ea4a8')
    return values.map(item => item?._id).includes('6318cd39e7947801394ea4aa');
  }, [values])


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

  const onOpenPaypalAlertModal = () => {
    navigation.navigate<any>(MainStackRouteNames.AlertModal, {
      message: `To send a PayPal link, you MUST add your preferred PayPal email in the Email field and connect your paypal account with us, before you request Paypal payment.`
    });
  };

  const onOpenAlertModal = () => {
    navigation.navigate<any>(MainStackRouteNames.AlertModal, {
      message: `To send a PayPal link, you MUST add your preferred PayPal email in the Email section from your Settings -> business profile -> Add your Email, before you request Paypal payment.`
    });
  };

  useEffect(() => {

    Linking.addEventListener('url', handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleOpenURL({ url });
      }
    });
  })

  const openURL = (url: string) => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  const requestPayment = () => {
    const data = form.current.values;
    if (!isOnlinePayments) {
      showMessage({
        type: 'warning',
        message: 'Please Enable Paypal Payments!',
      });
      return;
    }
    
    if (route.params?.invoiceId) {
      const body = {
        id: route.params?.invoiceId,
        email: data.email,
        text: data.text,
        isDefaultMessage: isDefaultMessage,
        paymentType: 'Cash',
      };
      if (values.map(item => item._id).includes('6318cd39e7947801394ea4aa')) {
        body.paymentType = 'Card';
        console.log('Body', body);
        dispatch(requestCardPaymentInvoice(body));
      } else {
        body.paymentType = 'Paypal';
        dispatch(requestPaymentMerchantInvoice(body));
      }
      const requestPaymentValues = form?.current?.values;
      if (route.params.callback) {
        route.params.callback({
          [returnValueName.current!]: { ...requestPaymentValues, isDefaultMessage: isDefaultMessage, payments: values },
        })
        navigation.goBack()
        return;
      }

      navigation.navigate<any>(backScreen.current, {
        [returnValueName.current!]: { ...requestPaymentValues, isDefaultMessage: isDefaultMessage, payments: values },
      });
      return;
    }
  }

  const handleOpenURL = async ({ url }: { url: String }) => {
    const [, paypalbiz_string] = url.match(/paypalbiz=([^#]+)/) || [];

    const paypalbiz = JSON.parse(decodeURI(paypalbiz_string))
    console.log(paypalbiz);
    if (paypalbiz.success) {
      showMessage({
        message: paypalbiz?.data?.message || 'Success',
        type: 'success',
      });

      dispatch(getUser());
      // navigation.goBack();
      
      // navigation.navigate<any>(backScreen.current, {
      //   [returnValueName.current!]: { ...requestPaymentValues, isDefaultMessage: isDefaultMessage, payments: values },
      // });

    } else {
      showMessage({
        message: paypalbiz?.data?.message || 'Error happens',
        type: 'danger',
      });
    }
    // dispatch(socialLogin(user));
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
  };

  const togglePayment = (onlinePayments: boolean) => {

    if (onlinePayments) {
      onOpenPaypalAlertModal();
      return setOnlinePaymentsState(onlinePayments);
    }

    Alert.alert('Are you sure you want to turn off online payments?', 'You will no longer to be access online payments for any of your invoices until you turn it back on. Your client will receive payment link only if you add the clients paypal email and click Send.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => setOnlinePaymentsState(onlinePayments) },
    ]);
  };

  const paypalPartnerSignup = async (flag = true) => {
    try {
      const requestPaymentValues = form?.current?.values;
      console.log(values);
      if (requestPaymentValues) {
        const request = requestPaymentValues;
        request.isEnableOnlinePayment = flag;
        console.log(request);
        setIsloading(true);
        const result = await api.post(ApiRequestEnum.PAYPAL_PARTNER_SIGNUP, request);
        console.log('Result:', result);
        const { data } = result;
        const response = data;
        console.log("response", response);
        setIsloading(false);
        console.log(onlinePaymentsState);
        if (response?.success) {
          if (response?.data?.link) {
            Alert.alert('Alert!', 'Your paypal account is not connected with us, to accept payment online please connect it.', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              { text: 'Connect', onPress: () => openURL(response?.data?.link) },
            ]);
          } else if (!onlinePaymentsState) {
            showMessage({
              message: response?.message,
              type: 'success',
            });
          } else if (onlinePaymentsState && response?.onboardingStatus) {
            showMessage({
              message: response?.message,
              type: 'success',
            });
          } else {
            showMessage({
              message: response?.message,
              type: 'danger',
            });
          }
        } else {
          showMessage({
            message: data?.data?.message || 'Error happens',
            type: 'danger',
          });
        }
      }
    } catch (e: any) {
      console.log("PAYPAL_PARTNER_SIGNUP Error =>", e);
      setIsloading(false);
      showMessage({
        message:
          e.response.data?.error ||
          e.response.data?.message ||
          'Error happens',
        type: 'danger',
      });
    }
  }

  const openCardPayment = () => {
    const url = CARD_PAYMENT_URL + 'invoice=' + formatedInvoice?.number + '&total=' + formatedInvoice?.total;
    openURL(url);
  };

  const __togglePayment = (payment: any) => {
    const isExist = values.find((item) => item._id == '6318cd39e7947801394ea4a8');
    if (isExist && payment._id === '6318cd39e7947801394ea4a8') {
      Alert.alert('Are you sure you want to turn off online payments?', 'You will no longer to be access online payments for any of your invoices until you turn it back on. Your client will receive payment link only if you add the clients paypal email and click Send.', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => {
          setOnlinePaymentsState(true);
          setValues(state => [...toggleArrayObject<any>(state, payment)]);
          paypalPartnerSignup(false);
        }},
      ]);
    } else {
      setValues(state => [...toggleArrayObject<any>(state, payment)]);
      if (payment._id === '6318cd39e7947801394ea4a8') {
        paypalPartnerSignup(true);
      }
    }
  };

  const toogleDefaultMessage = () => {
    setIsDefaultMessage(!isDefaultMessage)
  }

  const onSave = async (requestPaymentValues: any): Promise<void> => {
    // const existPaypalPayment = values.find((item: any) => item._id === '6318cd39e7947801394ea4a8');
    const existPaypalPayment = values.find((item: any) => item._id === '6318cd39e7947801394ea4aa');
    // without paypal
    if (!existPaypalPayment) {
      if (isDefaultMessage && business.result?._id) {
        const _businessItem = realm.objectForPrimaryKey<Business>('businesses', new BSON.ObjectID(business.result?._id));
        realm.write(() => {
          if (_businessItem) {
            _businessItem.message = requestPaymentValues.text
          }
        })
      }

      if (route.params.callback) {
        route.params.callback({
          [returnValueName.current!]: { ...requestPaymentValues, isDefaultMessage: isDefaultMessage, payments: values },
        })
        navigation.goBack()
        return;
      }

      navigation.navigate<any>(backScreen.current, {
        [returnValueName.current!]: { ...requestPaymentValues, isDefaultMessage: isDefaultMessage, payments: values },
      });
      return;
      // return navigation.navigate<any>(MainStackRouteNames.InvoiceSingle);
    }
    requestPayment();
  };

  const __onSave = (requestPaymentValues: any): void => {
    if (isDefaultMessage && business.result?._id) {
      const _businessItem = realm.objectForPrimaryKey<Business>('businesses', new BSON.ObjectID(business.result?._id));
      realm.write(() => {
        if (_businessItem) {
          _businessItem.message = requestPaymentValues.text
        }
      })
    }

    if (route.params.callback) {
      route.params.callback({
        [returnValueName.current!]: { ...requestPaymentValues, isDefaultMessage: isDefaultMessage, payments: values },
      })
      navigation.goBack()
      return;
    }

    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: { ...requestPaymentValues, isDefaultMessage: isDefaultMessage, payments: values },
    });
  };

  const onCancel = () => {
    if (route.params.callback) {
      navigation.goBack()
      return;
    }
    navigation.navigate<any>(backScreen.current);
  };

  const getPaymentIcon = (paymentName: string) => {
    switch (paymentName) {
      case 'Online Payments':
        return <Image resizeMode="contain" style={{ width: 100, height: 40, marginHorizontal: 24 }} source={Images.onlinePayment} />
      default:
        break;
    }
  };
  
  return (
    <View style={styles.container}>
      <Header
        title={'Add Payment Methods'}
        showBackBtn={true}
        rightSideComponent={invoiceId.current ? <TouchableOpacity
          onPress={() => setShowDotsPopup(state => !state)}
          style={styles.dotsContainer}>
          <DotsIcon />
        </TouchableOpacity> : null
        }
      />
      <PageContainer>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
        >
          <Formik
            innerRef={form}
            // initialValues={{
            //   ...route.params?.value,
            //   text: ((route.params?.value?.text !== undefined && route.params?.value?.text === "") || route.params?.value.text) ? route.params?.value.text : businessObj?.message
            // } || initialValues}
            initialValues={{ paypalEmail: route.params?.value?.email, text: route.params?.value?.text, email: route.params?.value?.email }}
            validateOnMount={true}
            onSubmit={onSave}>
            {({ isValid, handleSubmit }) => (
              <>
                <ScrollView
                  style={styles.container}
                  keyboardShouldPersistTaps={'handled'}>
                  {onlinePayments.length && (
                    <View>
                      <Text style={styles.paymentBlockTitle}>Payment Methods</Text>
                      {onlinePayments.map(payment => {
                        return (
                          <Card key={payment.name} containerStyle={styles.field}>
                            <View style={styles.paymentContainer}>
                              <>
                                <Text style={styles.paymentName}>{payment.name}</Text>
                                <ToggleSwitch
                                  size={'small'}
                                  isOn={values.map(item => item?._id).includes(payment._id)}
                                  onToggle={() => __togglePayment({ ...payment })}
                                  // isOn={onlinePaymentsState}
                                  // onToggle={() => togglePayment(!onlinePaymentsState)}
                                  trackOnStyle={{
                                    backgroundColor: '#5799F8',
                                  }}
                                />
                              </>
                            </View>
                            {getPaymentIcon(payment.name)}
                          </Card>
                        );
                      })}
                    </View>
                  )}
                  {isOnlinePayments && (
                    <>
                      <InputField
                        label={'Email'}
                        name={'email'}
                        containerStyle={styles.field}
                        textInputProps={{ autoCapitalize: "none" }}
                        placeholder={"Client Paypal Email"}
                      />
                      <InputField
                        label={'Message (optional)'}
                        name={'text'}
                        containerStyle={styles.field}
                        inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
                        textInputProps={{
                          multiline: true
                        }}
                      />
                      <Card containerStyle={styles.field}>
                        <View style={styles.toogleContainer}>
                          <>
                            <Text style={styles.txtDefaultName}>{'Save message as default'}</Text>
                            <ToggleSwitch
                              size={'small'}
                              isOn={isDefaultMessage}
                              onToggle={() => toogleDefaultMessage()}
                              trackOnStyle={{
                                backgroundColor: '#5799F8',
                              }}
                            />
                          </>
                        </View>
                      </Card>
                    </>
                  )}
                  {/* <Text style={[commonText.paragraphText, { marginHorizontal: 18 }]}>{`Note: You can share the PDF invoice through your preferred Social Media method by clicking the right Vertical Dots -> Share -> after you save this screen`}</Text> */}
                </ScrollView>
                <View
                  style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
                  <Button
                    text={isOnlinePayments ? 'Send' : 'Save'}
                    // text={'Save'}
                    containerStyle={styles.action}
                    onPress={handleSubmit}
                    type={BtnType.Primary}
                  />
                  <Button
                    text={'Cancel'}
                    type={BtnType.Outlined}
                    containerStyle={styles.action}
                    onPress={onCancel}
                  />
                </View>
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
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
  field: {
    marginBottom: 16,
  },
  toogleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtDefaultName: {
    flex: 1,
    ...font(14, 21),
    color: colors.text.grayText
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
    ...font(14, 21),
    color: colors.text.grayText,
    marginLeft: 16,
  },
  dotsContainer: {
    width: 24,
    height: 24,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  dotsDetailsContainer: {
    position: 'absolute',
    right: 24,
    backgroundColor: colors.whiteColor,
    zIndex: 30,
    borderRadius: 8,
  },
  dotsDetailsItem: {
    paddingHorizontal: 16,
    minWidth: 100,
    height: 40,
    justifyContent: 'space-between',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsDetailsItemWithoutBorder: {
    borderBottomWidth: 0,
  },
  dotsDetailsItemText: {
    ...font(14, 16),
    color: colors.text.darkGrayText,
  },
});
