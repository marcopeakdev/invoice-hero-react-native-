import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik, useFormikContext } from 'formik';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { InputField } from '../components/form/InputField';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BtnType, Button } from '../components/Button';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/selectors/user';
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RealmContext from "../database/RealmContext";
import { BSON } from "realm";
import { AddressSchema } from "../database/AddressSchema";
import { ClientSchema } from "../database/ClientSchema";
import { Client } from "../models/client";
import moment from "moment";

const { useQuery, useRealm } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.ClientCreate>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.ClientCreate
  >;
};

const ClientForm: React.FC<Props> = ({ route, navigation }) => {
  const formik = useFormikContext<any>();
  const insets = useSafeAreaInsets();

  const realm = useRealm();
  const clientRealm = route.params?.clientId && realm.objectForPrimaryKey('clients', route.params?.clientId);

  useEffect(() => {
    if (clientRealm) {
      const tempObj = clientRealm.toJSON()
      formik.setValues({
        ...tempObj
      })
    } else {
      formik.setValues({
        ...initialValues
      })
    }
  }, [route.params])

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <>
      <InputField
        label={'Name'}
        name={'name'}
        placeholder={'Enter name...'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Email'}
        placeholder={'Enter email...'}
        name={'email'}
        containerStyle={styles.field}
        keyboardType="email-address"
      />
      <InputField
        label={'Mobile'}
        placeholder={'Enter mobile...'}
        name={'phoneNumber'}
        containerStyle={styles.field}
        keyboardType="phone-pad"
      />
      <InputField
        label={'Contact'}
        placeholder={'Enter contact...'}
        name={'contact'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Address Line 1'}
        placeholder={'Enter address line 1...'}
        name={'address.street'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Address Line 2'}
        placeholder={'Enter address line 2...'}
        name={'address.apt'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Address Line 3'}
        placeholder={'Enter address line 3...'}
        name={'address.city'}
        containerStyle={styles.field}
      />
      <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          text={'Save'}
          containerStyle={styles.action}
          onPress={formik.handleSubmit}
          disabled={!formik.isValid}
        />
        <Button
          text={'Cancel'}
          type={BtnType.Outlined}
          containerStyle={styles.action}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

const initialValues: any = {
  name: '',
  contact: '',
  phoneNumber: '',
  email: '',
  address: {
    street: '',
    apt: '',
    city: ''
  }
};

export const ClientCreate: React.FC<Props> = props => {
  const { route, navigation } = props;

  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  const user = useSelector(selectUser);
  const clients = useQuery('clients')
  const ownClients = clients.filtered('user == $0', new BSON.ObjectID(user?._id))

  const isCanCreateClient = useMemo(() => {
    if (ownClients.length >= 2 && !(user?.subscriptionEndAt && moment().isBefore(user?.subscriptionEndAt))) {
      return false;
    }

    return true
  }, [ownClients])

  const realm = useRealm();
  const clientRealm = route.params?.clientId && realm.objectForPrimaryKey('clients', route.params?.clientId);

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }
  }, [route]);

  const onSubmit = async (values: any) => {
    if (values._id) {
      const item = realm.objectForPrimaryKey<Client>('clients', new BSON.ObjectID(values._id));
      if (item) {
        realm.write(() => {
          Object.keys(values).forEach(key => {
            item[key] = values[key]
          })
        });
      }

      if (backScreen.current) {
        if (route.params.callback) {
          route.params.callback({
            [returnValueName.current!]: item
          })
        }
        navigation.goBack()
      } else {
        navigation.navigate(MainStackRouteNames.MainBottomTabs);
      }
    } else {
      if (!isCanCreateClient) {
        navigation.navigate(MainStackRouteNames.SubscriptionModal
        );
        showMessage({
          message: 'Subscription required',
          type: 'danger',
        });
        return;
      }
      let address;
      let client;
      try {
        realm.write(() => {
          if (values.address) {
            address = AddressSchema.generate(values.address)
            client = realm.create('clients', ClientSchema.generate(
              {
                ...values,
                address: address,
                user: new BSON.ObjectID(user?._id),
              }
            ))
          }
        })

        if (route.params.callback) {
          route.params.callback({
            [returnValueName.current!]: client
          })
          navigation.goBack()
          return;
        }

        if (backScreen.current) {
          navigation.navigate<any>(backScreen.current, {
            [returnValueName.current!]: client?._id,
          });
        } else {
          navigation.navigate(MainStackRouteNames.MainBottomTabs);
        }
      } catch (e: any) {
        showMessage({
          message:
            e?.response?.data?.error ||
            e?.response?.data?.message ||
            'Can`t create client',
          type: 'danger',
        });
        console.log(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title={clientRealm?.name || 'Client Profile'} showBackBtn={true} />
      <PageContainer>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          viewIsInsideTabBar={true}
          extraScrollHeight={10}
        >
          <Formik
            initialValues={initialValues}
            validateOnMount={true}
            onSubmit={onSubmit}>
            <ClientForm {...props} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowValueContainer: {
    flex: 1,
  },
  rowIcon: {
    flexShrink: 0,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
});
