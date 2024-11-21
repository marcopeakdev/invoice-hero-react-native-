import React, { useEffect, useRef, useMemo, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '../components/form/InputField';
import { Checkbox } from '../components/Checkbox';
import { commonView } from '../styles/common';
import { Invoice } from '../models/invoice';
import RealmContext from '../database/RealmContext';

const { useRealm, useQuery, useObject } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoiceSingleItem>;
  navigation: NativeStackNavigationProp<MainStackParamList, MainStackRouteNames.AddInvoiceSingleItem>;
};

const validationSchema = Yup.object().shape({
  description: Yup.string(),
  rate: Yup.string(),
  hours: Yup.string(),
  isDefault: Yup.bool(),
});

export const AddInvoiceSingleItem: React.FC<Props> = ({ route, navigation }) => {
  const returnValueName = useRef<string | null>(null);
  const insets = useSafeAreaInsets();
  const [checked, setCheckedDefault] = useState(false);
  const realm = useRealm();

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }
  }, [route]);

  const invoiceId: any = useMemo(() => {
    return route?.params?.invoiceId;
  }, [route?.params]);

  const itemIndex: any = useMemo(() => {
    return route?.params?.itemIndex;
  }, [route?.params]);
  
  const existItem: any = useMemo(() => {
    if(itemIndex > -1) {
      return route?.params?.items[itemIndex];
    }
    return {};
  }, [route?.params]);

  useEffect(() => {
    if (existItem && existItem.isDefault) {
      setCheckedDefault(true);
    }
  }, [existItem]);

  const initialValues = {
    description: existItem?.description ?? '',
    rate: String(existItem?.rate ?? '') ?? '',
    hours: String(existItem?.hours ?? '') ?? '',
    isDefault: existItem?.isDefault ?? false,
    selected: existItem?.selected ?? false,
  };

  const onSave = (values: any) => {
    const totalItems = route?.params?.items || [];
    let tempItems = [...totalItems];
    if(itemIndex > -1) {
      tempItems[itemIndex] = values; 
    } else {
      tempItems = [...tempItems, values];
    }

    console.log(tempItems);
    const _invoiceItem: any = realm.objectForPrimaryKey<Invoice>('invoices', invoiceId);

    realm.write(() => {
      _invoiceItem['items'] = tempItems.map((item) => ({
        description: item.description,
        rate: Number(item.rate),
        hours: Number(item.hours),
        isDefault: checked,
        selected: item.selected,
      }));
    });
    navigation.goBack();
  };

  const handleCheckboxChange = (status: boolean) => {
    setCheckedDefault(status);
  }
  
  return (
    <View style={styles.container}>
      <Header title={'Create New Item'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={
            initialValues
          }
          enableReinitialize={true}
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={onSave}
        >
          {({ isValid, values, handleSubmit }) => (
            <>
              <ScrollView style={styles.container}>
                <View style={styles.field}>
                  <InputField
                    label={'Item Name'}
                    name={'description'}
                    containerStyle={styles.field}
                  />
                </View>
                <View style={styles.field}>
                  <InputField
                    label={'Rate'}
                    keyboardType={'numeric'}
                    name={'rate'}
                    containerStyle={styles.field}
                    inputIcon={<Text style={commonView.cardRowValue}>$</Text>}
                  />
                </View>
                <View style={styles.field}>
                  <InputField
                    label={'Quantity'}
                    keyboardType={'numeric'}
                    name={'hours'}
                    containerStyle={styles.field}
                  />
                </View>
                <View style={[styles.field, { paddingHorizontal: 20 }]}>
                  <Checkbox label='Set default quantity for this item' onChange={handleCheckboxChange} checked={values.isDefault} />
                </View>
                <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
                  <Button
                    text={'Save'}
                    containerStyle={styles.action}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  />
                </View>
              </ScrollView>
            </>
          )}
        </Formik>
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
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  itemsRowInput: {
    flex: 1,
    marginHorizontal: 0,
  },
  itemsCard: {
    marginHorizontal: 0,
    marginRight: 8,
  },
  customLabel: {
    paddingHorizontal: 0,
  },
  field: {
    marginBottom: 5,
  },
});
