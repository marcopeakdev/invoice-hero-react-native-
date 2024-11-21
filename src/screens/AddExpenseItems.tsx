import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FieldArray, Formik } from 'formik';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BtnType, Button } from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RealmContext from '../database/RealmContext';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash'
import { colors } from '../styles/colors';
import { PlusIcon } from '../components/icons/PlusIcon';
import { font } from '../styles/font';
import { CustomInvoiceItem, RightComponentType } from '../components/CustomInvoiceItem';
import { Expense } from '../models/expense';
import { DependFieldsExpenseItems } from '../components/form/DependFieldsExpenseItems';

const { useRealm, useObject } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddExpenseItems>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddExpenseItems
  >;
};

const formatExpenseToForm = (expense: any) => {
  let result = {
    purpose: expense?.number,
    merchant: expense?.merchant || '',
    attachments: expense?.attachments || [],
    date: {
      date: expense?.date || new Date(),
    },
    items: {
      subTotal: expense?.subTotal || 0,
      discountRate: expense?.discountRate ? String(expense?.discountRate) : '0',
      discount: expense?.discount ? String(expense?.discount) : '0',
      tax: expense?.tax ? String(expense?.tax) : '0',
      taxRate: expense?.taxRate ? String(expense?.taxRate) : '0',
      total: expense?.total || 0,
      items: (expense?.items || []).map((item: { rate: any; hours: any; description: string, selected: boolean }) => {
        return {
          ...item,
          description: item.description || '',
          rate: String(item.rate || 0),
          hours: String(item.hours || 0),
          selected: item.selected || false,
        };
      }),
    },
  };

  return result;
};

const initialValues = {
  items: [
    {
      description: '',
      rate: '',
      hours: '',
      selected: false
    },
  ],
  subTotal: 0,
  discountRate: '0',
  discount: '0',
  tax: '0',
  taxRate: '0',
  total: 0,
  deposit: '0'
};

const validationSchema = Yup.object().shape({
  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required(),
        rate: Yup.string().required(),
        hours: Yup.string().required(),
      }),
    )
    .required('Required'),
});
// TODO: This component should be rewriten
export const AddExpenseItems: React.FC<Props> = ({ route, navigation }) => {
  const returnValueName = useRef<string | null>(
    route.params?.returnValueName || null,
  );
  const backScreen = useRef<string | null>(route.params?.backScreen || null);
  const [category, setCategory] = useState<any | null>(null);

  const formatedExpense = useObject<Expense>('expenses', route.params?.expenseId);
  const [allItems, setAllItems] = useState<any | null>(formatedExpense?.items || []);

  const realm = useRealm();

  const allItemsList: any = useMemo(() => {
    if (formatedExpense) {
      return formatedExpense?.items || [];
    }
    return [];
  }, [formatedExpense]);

  const dataForm = useMemo(() => {
    return formatExpenseToForm(formatedExpense);
  }, [formatedExpense]);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.value && route.params.value?.category) {
      setCategory(route.params.value?.category);
    }
  }, [route]);

  const initFormikValues = useMemo(() => {
    if (route.params?.value) {
      let tempValue = {
        ...route.params?.value,
      }

      return {
        deposit: tempValue?.deposit ? String(tempValue?.deposit) : '0',
        subTotal: tempValue?.subTotal || 0,
        discountRate: tempValue?.discountRate ? String(tempValue?.discountRate) : '0',
        discount: tempValue?.discount ? String(tempValue?.discount) : '0',
        tax: tempValue?.tax ? String(tempValue?.tax) : '0',
        taxRate: tempValue?.taxRate ? String(tempValue?.taxRate) : '0',
        total: tempValue?.total || 0,
        items: allItemsList && allItemsList.length ? allItemsList.filter((item: any) => item?.selected).map((item: { rate: any; hours: any; description: string; selected: boolean; }) => {
          return {
            ...item,
            description: item.description || '',
            rate: item.rate || 0,
            hours: item.hours || 0,
            selected: item.selected || false,
          };
        }) : initialValues.items,
        category: tempValue?.tempValue || null
      }
    } else {
      return initialValues
    }
  }, [new Date()])

  const onSave = (values: any) => {
    const items = allItemsList.map((item: { hours: string; rate: string; description: string, selected: boolean }) => ({
      description: item.description,
      hours: parseInt(item.hours),
      rate: parseInt(item.rate),
      selected: item.selected || false,
    }))

    const tempObj = {
      ...values,
      discountRate: Number(values.discountRate || 0),
      discount: Number(values.discount || 0),
      tax: Number(values.tax || 0),
      taxRate: Number(values.taxRate || 0),
      items,
    }

    if (route.params.callback) {
      route.params.callback({
        items: tempObj,
      })
      navigation.goBack();
      return;
    }
    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: {
        ...values,
        category,
      },
    });
  };

  const onCancel = () => {
    const items: any = allItemsList.map((item: { hours: string; rate: string; description: string, selected: boolean, isDefalut: boolean }) => ({
      description: item.description,
      hours: parseInt(item.hours),
      rate: parseInt(item.rate),
      selected: false,
      isDefalut: item.isDefalut || false,
    }));
    const values = route.params?.value;

    const tempObj = {
      ...values,
      deposit: 0,
      discountRate: 0,
      discount: 0,
      tax: 0,
      taxRate: 0,
      total: 0,
      items,
    }

    if (route.params.callback) {
      route.params.callback({
        items: tempObj,
      })
      navigation.goBack();
      return;
    }
    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: {
        ...values,
        category,
      },
    });
  };

  const handleAddItems = () => {
    navigation.navigate(MainStackRouteNames.AddExpenseItemsList, {
      value: { ...route.params?.value },
      expenseId: route.params?.expenseId,
      returnValueName: 'AddExpenseItemsList',
    });
  };

  const calculateSubTotal = (list: any) => {
    const d = list.reduce((a: number, c: any) => {
      let result = 0;

      if (c.rate && c.hours) {
        result = Number(c.rate) * Number(c.hours);
      }

      return a + result;
    }, 0);
    return d;
  }

  const handleQuantity = (value: number, index: number) => {
    const items = dataForm.items.items || [];
    if (items[index]) {
      items[index].hours = Number(items[index].hours) + value;
      setAllItems([...items]);
    }

    if (route.params?.expenseId) {
      const _expenseItem: any = realm.objectForPrimaryKey<Expense>('expenses', route.params?.expenseId);
      const subtotal = calculateSubTotal(items);
      if (_expenseItem) {
        realm.write(() => {
          _expenseItem['items'] = [...items.map((item: any) => ({ description: item.description, hours: Number(item.hours), rate: Number(item.rate), selected: item.selected, isDefault: item.isDefault }))];
          _expenseItem['subTotal'] = subtotal;
          _expenseItem['discount'] = Math.round(((subtotal * Number(route.params.value?.discountRate)) / 100) * 100) / 100;
          _expenseItem['tax'] = Math.round((((subtotal - _expenseItem['discount']) * Number(route.params.value?.taxRate)) / 100) * 100) / 100;
          _expenseItem['total'] = subtotal - (_expenseItem['discount'] ? Number(_expenseItem['discount']) : 0) + (_expenseItem['tax'] ? Number(_expenseItem['tax']) : 0);
        });
      }
    }
  }

  const handleRemoveItem = (index: number) => {
    let items: any = dataForm.items.items || [];
    if (items && items[index]) {
      items[index].selected = false;
      setAllItems([...items]);
    }

    if (route.params?.expenseId) {
      const _expenseItem: any = realm.objectForPrimaryKey<Expense>('expenses', route.params?.expenseId);
      const subtotal = calculateSubTotal(items.filter((item: any) => item.selected));
      const deposit = route.params?.value?.deposit;
      if (_expenseItem) {
        realm.write(() => {
          _expenseItem['items'] = [...items.map((item: any) => ({ description: item.description, hours: Number(item.hours), rate: Number(item.rate), selected: item.selected, isDefault: item.isDefault }))];
          _expenseItem['subTotal'] = subtotal;
          _expenseItem['discount'] = Math.round(((subtotal * Number(route.params.value?.discountRate)) / 100) * 100) / 100;
          _expenseItem['tax'] = Math.round((((subtotal - _expenseItem['discount']) * Number(route.params.value?.taxRate)) / 100) * 100) / 100;
          _expenseItem['total'] = subtotal - (_expenseItem['discount'] ? Number(_expenseItem['discount']) : 0) + (_expenseItem['tax'] ? Number(_expenseItem['tax']) : 0);
        });
      }
    }
  }

  const handleRemove = (index: number) => {
    handleRemoveItem(index);
  }

  const handleClickEdit = (index: number) => {
    navigation.navigate(MainStackRouteNames.AddExpenseSingleItem, {
      expenseId: route?.params?.expenseId,
      items: allItems,
      itemIndex: index,
    });
  };

  return (
    <View style={styles.container}>
      <Header title={'Add items'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={initFormikValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSave}>
          {({ handleSubmit, values, isValid }) => (
            <>
              <KeyboardAwareScrollView style={styles.container}>
                <View style={{ marginVertical: 4, paddingHorizontal: 24 }}>
                  <Text style={{ color: colors.gray, fontSize: 17, }}>Item</Text>
                </View>
                <FieldArray name={'items'}>
                  {({ remove, push }) => {
                    return (
                      <View style={styles.field}>
                        {(allItemsList || []).map(
                          (item: any, index: number) => {
                            return item.selected ? (
                              <View key={index} style={{ paddingHorizontal: 18 }}>
                                <CustomInvoiceItem
                                  onRemoveItem={() => handleRemove(index)}
                                  onChangeValue={(val: number) => handleQuantity(val, index)}
                                  title={item.description}
                                  subTitle={'$' + (Number(item.rate) * Number(item.hours)).toFixed(2)}
                                  type={RightComponentType.Quantity}
                                  value={Number(item.hours)}
                                  onClickEdit={() => handleClickEdit(index)}
                                />
                              </View>
                            ) : (<View key={index}></View>);
                          },
                        )}
                        <View style={styles.actions}>
                          <TouchableOpacity onPress={handleAddItems}>
                            <View style={[styles.cardRowBorderValue, styles.cardRowButton, { marginTop: 0, borderRadius: 5, backgroundColor: 'rgba(45, 122, 234, 0.1)', paddingHorizontal: 18, paddingVertical: 13 }]}>
                              <Text style={{ color: colors.bluePrimary }}>Add Items</Text>
                              <View style={{ marginRight: 10 }}>
                                <PlusIcon size={16} color={colors.bluePrimary} />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                </FieldArray>
                <DependFieldsExpenseItems />
                <View
                  style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
                  <Button
                    text={'Save'}
                    containerStyle={styles.action}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  />
                  <Button
                    text={'Clear All'}
                    type={BtnType.Outlined}
                    containerStyle={styles.action}
                    onPress={onCancel}
                  />
                </View>
              </KeyboardAwareScrollView>
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
  field: {
    marginBottom: 16,
  },
  cardRowBorderValue: {
    flex: 1,
    ...font(14, 21, '300'),
    color: colors.text.darkGrayText,
    borderBottomColor: colors.text.grayText,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  cardRowButton: {
    borderBottomWidth: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  itemsCard: {
    marginHorizontal: 0,
  },
  itemsRowField: {
    flex: 1,
  },
  itemsRowIcon: {
    marginBottom: 16,
    paddingHorizontal: 15,
  },
});
