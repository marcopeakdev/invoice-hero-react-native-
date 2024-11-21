import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useFormik } from 'formik';
import { FormField } from '../components/FormField';
import * as Yup from 'yup';
import { PlusIcon } from '../components/icons/PlusIcon';
import { colors } from '../styles/colors';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { RouteProp } from '@react-navigation/native';
import { commonView } from '../styles/common';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InvoiceStatus } from '../models/invoice';
import { showMessage } from 'react-native-flash-message';
import { CustomTabs } from '../components/CustomTabs';
import { CustomInvoice } from '../components/CustomInvoice';
import { selectBusiness } from '../store/selectors/business';
import RealmContext from '../database/RealmContext';
import { InvoiceSchema } from '../database/InvoiceSchema';
import { selectUser } from '../store/selectors/user';
import { BSON } from 'realm';

const { useRealm, useQuery } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceCreate>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.InvoiceCreate,
    MainStackRouteNames.ClientDropDownList
  >;
};

const formatInvoiceFromForm = (invoice: any) => {
  let result = {
    number: invoice.number,
    billTo: invoice.billTo,
    customs: invoice.customs || [],
    delivery: invoice.delivery || null,
    payments: invoice.payments || [],
    attachments: invoice.attachments || [],
    status: invoice.status,
  };

  if (invoice.date) {
    result = {
      ...result,
      ...invoice.date,
    };
  }

  if (invoice.items) {
    result = {
      ...result,
      ...invoice.items,
    };
  }

  return result;
};

const formatInvoiceToForm = (invoice: any) => {
  let result = {
    number: invoice.number,
    billTo: invoice?.billTo || '',
    customs: invoice.customs || [],
    delivery: invoice.delivery || null,
    payments: invoice?.payments || [],
    status: invoice.status,
    attachments: invoice.attachments || [],
    date: {
      date: invoice?.date || null,
      dueDate: invoice?.dueDate || null,
      recurringPeriod: invoice?.recurringPeriod || null,
    },
    items: {
      subTotal: invoice?.subTotal || 0,
      discountRate: invoice?.discountRate ? invoice?.discountRate : 0,
      discount: invoice?.discount ? invoice?.discount : 0,
      tax: invoice?.tax ? invoice?.tax : 0,
      taxRate: invoice?.taxRate ? invoice?.taxRate : 0,
      total: invoice.total || 0,
      items: (invoice.items || []).map((item: any) => {
        return {
          ...item,
          description: item.description || '',
          rate: item.rate || 0,
          hours: item.hours || 0,
        };
      }),
      category: invoice.category || null,
    },
    signature: invoice.signature,
    notes: invoice.notes,
  };

  return result;
};

export const InvoiceCreate: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch<any>();
  const invoiceId = useRef<string | null>(null);
  const TABS = [invoiceId.current ? 'Edit' : 'Create', 'Preview'];
  const [activeTab, setActiveTab] = useState<string>();

  const business = useSelector(selectBusiness);
  const user = useSelector(selectUser);

  const realm = useRealm();
  const invoices = useQuery('invoices').filtered('user == $0', new BSON.ObjectID(user?._id))

  const isCanCreateInvoice = useMemo(() => {
    if (invoices.length > 2 && !(user?.subscriptionEndAt && moment().isBefore(user?.subscriptionEndAt))) {
      return false;
    }

    return true
  }, [invoices])

  const invoiceCount = useMemo(() => {
    return invoices.length
  }, [invoices])

  useEffect(() => {
    setActiveTab(invoiceId.current ? 'Edit' : 'Create');
  }, [invoiceId.current]);

  const insets = useSafeAreaInsets();

  const handleAddInvoice = useCallback((invoice: any) => {
    console.log(invoice);
    let _invoice:any;
    realm.write(() => {
      _invoice = realm.create('invoices', InvoiceSchema.generate(invoice));
    })
    if (_invoice) {
      showMessage({
        message:
          _invoice.status === InvoiceStatus.Estimate
            ? 'Estimate created'
            : 'Invoice created',
        type: 'success',
      });

      navigation.replace(MainStackRouteNames.InvoiceSingle, {
        id: _invoice._id,
        title: _invoice.number,
        estimate: _invoice.status === InvoiceStatus.Estimate,
      });
    }
  }, [realm])

  const formik = useFormik({
    initialValues: {
      number: null,
      billTo: null,
      date: {
        date: new Date(),
        dueDate: new Date(),
        recurringPeriod: null,
      },
      status: route.params?.estimate
        ? InvoiceStatus.Estimate
        : InvoiceStatus.Unpaid,
      items: null,
      payments: [],
      attachments: [],
      delivery: {
        email: '',
        text: ''
      },
      customs: [],
      signature: {},
      note: '',
    },
    validationSchema: Yup.object().shape({
      billTo: Yup.object().required('Required Field'),
    }),
    onSubmit: async values => {
      const result = formatInvoiceFromForm(values);
      console.log(result);
      if (!isCanCreateInvoice) {
        navigation.navigate(MainStackRouteNames.SubscriptionModal);
        showMessage({
          message: 'Subscription required',
          type: 'danger',
        });
        return;
      }
      handleAddInvoice({
        ...result,
        payments: result.payments.map((item: any) => item),
        number: String(invoiceCount + 1).padStart(6, '0'),
        user: user?._id
      })
    },
  });

  const defaultMessage = useMemo(() => {
    return formik.values.delivery?.text || business.result?.message || ''
  }, [business, formik.values])


  const onUpdateInvoice = (data: any) => {

    if (data.billTo || data.billTo === null) {
      formik.setFieldValue('billTo', data.billTo);
    }

    if (data.date) {
      formik.setFieldValue('date', data.date);
    }

    if (data.items) {
      formik.setFieldValue('items', data.items);
    }

    if (data.requestPayment) {
      const tempPayments = data.requestPayment.payments.map((_item: any) => ({
        ..._item,
      }))
      formik.setFieldValue('delivery', {
        text: data.requestPayment.text,
        email: data.requestPayment.email,
        isDefaultMessage: data.requestPayment.isDefaultMessage
      });
      formik.setFieldValue('payments', tempPayments);
    }

    if (data.customs) {
      formik.setFieldValue('customs', data.customs);
    }

    if (data.attachments) {
      formik.setFieldValue('attachments', data.attachments);
    }
  }

  useEffect(() => {
    if (route.params?.invoice) {
      invoiceId.current = route.params?.invoice?._id || null;
      const preparedInvoice = formatInvoiceToForm(route.params?.invoice);
      // @ts-ignore
      formik.setValues(preparedInvoice);
    }
  }, [route]);


  const formattedItems = useMemo(() => {
    const items: any = formik.values.items;
    if (!items) {
      return '';
    }

    let category = items.category?.name;

    return `${category || 'No category'}: ${items.items
      .map((item: any) => item.description)
      .join(', ')}`;
  }, [formik.values.items,]);

  const formattedPayments = useMemo(() => {
    return (formik.values.payments || [])
      .map((payment:any) => {
        return payment?.name || '-';
      })
      .join(', ');
  }, [formik.values.payments]);

  const formattedCustoms = useMemo(() => {
    return (formik.values.customs || [])
      .map((custom: any) => custom?.name || 'None')
      .join(', ');
  }, [formik.values.customs]);

  const onSelectClient = () => {
    navigation.navigate(MainStackRouteNames.ClientDropDownList, {
      title: 'Select client',
      returnValueName: 'billTo',
      backScreen: MainStackRouteNames.InvoiceCreate,
      selectedValue: formik.values.billTo || null,
      callback: onUpdateInvoice
    });
  };

  const onAddDate = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceDate, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'date',
      value: formik.values.date,
      callback: onUpdateInvoice
    });
  };

  const clientPlusClick = () => {
    navigation.navigate(MainStackRouteNames.ClientCreate, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'billTo',
      callback: onUpdateInvoice
    });
  };

  const onAddItems = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceItems, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'items',
      value: formik.values.items,
      isEstimate: formik.values.status === InvoiceStatus.Estimate,
      callback: onUpdateInvoice
    });
  };

  const onAddPayments = () => {
    navigation.navigate(MainStackRouteNames.RequestPayment, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'requestPayment',
      value: { ...formik.values.delivery, text: defaultMessage },
      payments: formik.values.payments,
      callback: onUpdateInvoice
    });
  };


  const onAddCustoms = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceCustoms, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'customs',
      value: formik.values.customs,
      callback: onUpdateInvoice
    });
  };

  const onAddAttachments = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceAttachments, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'attachments',
      value: formik.values.attachments,
      callback: onUpdateInvoice
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title={`${invoiceId.current ? 'Edit' : 'Create'} ${formik.values.status === InvoiceStatus.Estimate
          ? 'Estimate'
          : 'Invoice'
          }`}
        showBackBtn={true}>
        <CustomTabs
          tabs={TABS}
          active={activeTab}
          setActiveTab={e => setActiveTab(e)}
        />
      </Header>

      <View
        style={{
          backgroundColor: '#fff',
          marginTop: -30,
          borderTopEndRadius: activeTab !== 'Preview' ? 20 : 0,
          borderTopLeftRadius: activeTab === 'Preview' ? 20 : 0,
          paddingTop: 12,
          flex: 1,
        }}>
        <ScrollView>
          {activeTab !== 'Preview' ? (
            <View style={{ marginTop: 12 }}>
              <FormField label={'Invoice number'} containerStyle={styles.field}>
                <Text style={commonView.cardRowValue}>
                  #
                  {formik.values.number ||
                    String(invoiceCount + 1).padStart(6, '0')}
                </Text>
              </FormField>
              <FormField
                onPress={onSelectClient}
                label={'Bill to'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  {formik.values.billTo ? (
                    <Text style={commonView.cardRowValue}>
                      {
                        formik.values.billTo?.name
                      }
                    </Text>
                  ) : (
                    <Text style={commonView.cardRowPlaceholder}>
                      Select client
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={clientPlusClick}
                    style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </TouchableOpacity>
                </View>
              </FormField>
              <FormField
                onPress={onAddDate}
                label={'Date'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.date ? (
                      <Text style={commonView.cardRowValue}>
                        {`${moment(formik.values.date?.date).format(
                          'MMM DD, yyyy',
                        )} - ${moment(formik.values.date?.dueDate).format(
                          'MMM DD, yyyy',
                        )}`}
                        {Boolean(formik.values.date?.recurringPeriod) &&
                          `, Every ${formik.values.date?.recurringPeriod} months`}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Set date
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddItems}
                label={'Items'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.items ? (
                      <Text style={commonView.cardRowValue}>
                        {formattedItems}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add items
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddPayments}
                label={'Payment method'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.payments?.length ? (
                      <Text style={commonView.cardRowValue}>
                        {formattedPayments}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add payment method
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddAttachments}
                label={'Attachments'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.attachments?.length ? (
                      <Text style={commonView.cardRowValue}>
                        Selected {formik.values.attachments?.length} images
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add attachments
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddCustoms}
                label={'Other'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.customs?.length ? (
                      <Text style={commonView.cardRowValue}>
                        {formattedCustoms}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add custom fields
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <View
                style={[
                  styles.actionsContainer,
                  { paddingBottom: insets.bottom },
                ]}>
                <Button
                  text={'Save'}
                  disabled={!formik.isValid}
                  onPress={() => {
                    formik.handleSubmit();
                  }}
                  containerStyle={styles.btn}
                />
              </View>
              <View style={{ height: 150 }} />
            </View>
          ) : (
            <View style={{ margin: 12 }}>
              <CustomInvoice
                data={{
                  number:
                    '#' +
                    (formik.values.number ||
                      String(invoiceCount + 1).padStart(6, '0')),
                  date: formik.values.date?.date
                    ? moment(formik.values.date?.date).format('MMM DD, yyyy')
                    : '-',
                  billTo: formik.values.billTo,
                  items: formik.values.items,
                  attachments: formik.values.attachments,
                  signature: formik.values.signature,
                  note: formik.values?.note,
                }}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  field: {
    marginBottom: 24,
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
  },
  btn: {
    marginBottom: 16,
  },
  actionsContainer: {
    paddingHorizontal: 24,
  },
});
