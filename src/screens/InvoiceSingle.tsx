import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { RouteProp } from '@react-navigation/native';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInvoice, requestPaymentInvoice } from '../store/thunk/invoices';
import { colors } from '../styles/colors';
import { FormField } from '../components/FormField';
import { BtnType, Button } from '../components/Button';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { Invoice, InvoiceMenuAction, InvoiceStatus } from '../models/invoice';
import { font } from '../styles/font';
import { api } from '../utils/api';
import { DotsIcon } from '../components/icons/DotsIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { commonView } from '../styles/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isIOS } from '../utils/constants';
import { showMessage } from 'react-native-flash-message';
import { CustomTabs } from '../components/CustomTabs';
import { CustomInvoice } from '../components/CustomInvoice';
import { selectBusiness } from '../store/selectors/business';
import { ShareIcon } from '../components/icons/ShareIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { DuplicateIcon } from '../components/icons/DuplicateIcon';
import RNPrint from 'react-native-print';
import { PrinterIcon } from '../components/icons/PrinterIcon';
import { currencyFormatter } from '../utils/currency';
import { AdditionalParallaxProps, ParallaxImage } from 'react-native-snap-carousel';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
// import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';
import { InvoiceSchema } from '../database/InvoiceSchema';
import { selectUser } from '../store/selectors/user';
import Spinner from 'react-native-loading-spinner-overlay';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { selectPayments } from '../store/selectors/payments';
import { PaymentType } from '../models/payment';
import { EditIcon } from '../components/icons/EditIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import FastImage from 'react-native-fast-image';

const { useRealm, useQuery, useObject } = RealmContext;

const width = Dimensions.get('window').width;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceSingle>;
  navigation: NativeStackNavigationProp<MainStackParamList, MainStackRouteNames.InvoiceSingle>;
};

const formatInvoiceToForm = (invoice: any) => {
  let result = {
    number: invoice?.number,
    billTo: invoice?.billTo || '',
    customs: invoice?.customs || [],
    note: invoice?.note || '',
    delivery: invoice?.delivery || null,
    payments:
      invoice?.payments?.toJSON().map((item: any) => ({ ...item, _id: item._id.toString() })) || [],
    status: invoice?.status,
    attachments: invoice?.attachments || [],
    date: {
      date: invoice?.date || new Date(),
      dueDate: invoice?.dueDate || new Date(),
      recurringPeriod: invoice?.recurringPeriod || null,
    },
    items: {
      deposit: invoice?.deposit || 0,
      subTotal: invoice?.subTotal || 0,
      discountRate: invoice?.discountRate ? String(invoice?.discountRate) : '0',
      discount: invoice?.discount ? String(invoice?.discount) : '0',
      tax: invoice?.tax ? String(invoice?.tax) : '0',
      taxRate: invoice?.taxRate ? String(invoice?.taxRate) : '0',
      total: invoice?.total || 0,
      items: (invoice?.items || []).map((item: { rate: any; hours: any; description: string, selected: boolean }) => {
        return {
          ...item,
          description: item.description || '',
          rate: String(item.rate || 0),
          hours: String(item.hours || 0),
          selected: item.selected || false,
        };
      }),
      category: invoice?.category || null,
    },
  };

  return result;
};

export const InvoiceSingle: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useDispatch<any>();
  const insets = useSafeAreaInsets();
  const [showDotsPopup, setShowDotsPopup] = useState(false);
  const [estimate, setEstimate] = useState(!!route.params?.estimate);
  const [hadUpdatedInvoice, setHadUpdatedInvoice] = useState(false);
  const [spinnerFlag, setSpinnerFlag] = useState(false);
  // Loading Screen management
  const [isLoading, setIsLoading] = useState(false);
  const callback = route.params?.callback;

  const TABS = ['Invoice', 'Preview'];
  const [activeTab, setActiveTab] = useState<string>('Invoice');

  const business = useSelector(selectBusiness);
  const user = useSelector(selectUser);
  const payments = useSelector(selectPayments);

  const realm = useRealm();
  const invoices = useQuery<Invoice>('invoices');
  const ownInvoices = invoices.filtered('user == $0', new BSON.ObjectID(user?._id));

  const invoiceCount = useMemo(() => {
    return ownInvoices.length;
  }, [ownInvoices]);

  const isCanCreateInvoice = useMemo(() => {
    if (
      ownInvoices.length > 2 &&
      !(user?.subscriptionEndAt && moment().isBefore(user?.subscriptionEndAt))
    ) {
      return false;
    }
    return true;
  }, [ownInvoices]);

  const shouldDeleteInvoice = useMemo(() => {
    return !route.params?.id && !hadUpdatedInvoice;
  }, [hadUpdatedInvoice, route.params?.id]);

  useEffect(() => {
    if (!isCanCreateInvoice && !route.params?.id) {
      navigation.navigate(MainStackRouteNames.SubscriptionModal, {
        callback: () => {
          navigation.goBack();
        },
      });
      showMessage({
        message: 'Subscription required',
        type: 'danger',
      });
    }
  }, [route.params?.id, isCanCreateInvoice]);

  const onlinePayments = useMemo(() => {
    const filteredPayments = payments.filter(payment => payment.type === PaymentType.OnlineCashPayments);
    const result = filteredPayments.map(item => ({ ...item, _id: new BSON.ObjectID(item._id) }));

    return result;
  }, [payments]);

  const formatedInvoiceId = useMemo(() => {
    let _invoiceId;
    if (route.params?.id) {
      _invoiceId = route.params?.id;
    } else {
      if (isCanCreateInvoice) {
        realm.write(() => {
          const schema = InvoiceSchema.generate({
            items: [],
            attachments: [],
            status: estimate ? InvoiceStatus.Estimate : InvoiceStatus.Unpaid,
            number: String(invoiceCount + 1).padStart(6, '0'),
            user: user?._id,
            date: new Date(),
            dueDate: new Date(),
          });
          const _invoice = realm.create<Invoice>(
            'invoices',
            schema
          );;
          _invoiceId = _invoice?._id;
        });
      }
    }
    return new BSON.ObjectID(_invoiceId);
  }, [route.params?.id]);

  const formatedInvoice = useObject<Invoice>('invoices', formatedInvoiceId);

  const dataForm = useMemo(() => {
    return formatInvoiceToForm(formatedInvoice);
  }, [formatedInvoice]);

  const unpaidInvoice = useMemo(() => {
    return formatedInvoice?.status === InvoiceStatus.Unpaid;
  }, [formatedInvoice]);

  const isOnlinePayments = useMemo(() => {
    return dataForm.payments
      .map((_item: any) => _item._id.toString())
      .includes('6318cd39e7947801394ea4a8');;
  }, [dataForm]);

  const invoiceId: any = useMemo(() => {
    return formatedInvoice?._id;
  }, [formatedInvoice]);

  const invoiceNumber = useMemo(() => {
    return dataForm.number;
  }, [dataForm]);

  const title = useMemo(() => {
    return `Create ${estimate ? 'Estimate' : 'Invoice'}`;
  }, [estimate]);

  const customData = useMemo(() => {
    const formData = formatInvoiceToForm(formatedInvoice);

    return {
      number: '#' + formData?.number,
      date: formData?.date?.date ? moment(formData?.date.date).format('MM/DD/yyyy') : '-',
      billTo: formatedInvoice?.billTo,
      items: formData?.items,
      createdAt: moment(formatedInvoice?.createdAt).format('MM/DD/yyyy'),
      paidDate: formatedInvoice?.paidDate
        ? moment(formatedInvoice?.paidDate).format('MM/DD/yyyy')
        : '-',
      note: formData.note,
      attachments: formData.attachments ?? [],
      signature: formatedInvoice?.signature,
    };
  }, [formatedInvoice]);

  const onUpdateInvoice = (data: any) => {
    const _invoiceItem: any = realm.objectForPrimaryKey<Invoice>('invoices', invoiceId);
    if (_invoiceItem) {
      realm.write(() => {
        let body: any = {};
        if (data.billTo || data.billTo === null) {
          body = { billTo: data.billTo };
        }

        if (data.date) {
          body = { ...body, ...data.date };
        }

        if (data.items) {
          body = { ...body, ...data.items };
          if (
            formatedInvoice?.status !== InvoiceStatus.Estimate &&
            body.deposit &&
            !Number.isNaN(body.deposit)
          ) {
            if (Number(body.deposit) > 0 && Number(body.deposit) < Number(body.total)) {
              body = {
                ...body,
                status: 'PartiallyPaid',
                paidDate: new Date().toISOString(),
              };
            } else if (Number(body.deposit) >= Number(body.total)) {
              body = {
                ...body,
                status: 'Paid',
                paidDate: new Date().toISOString(),
              };
            } else if (Number(body.deposit) === 0) {
              body = {
                ...body,
                status: 'Unpaid',
                paidDate: null,
              };
            }
          }
        }

        if (data.requestPayment) {
          const tempPayments = data.requestPayment.payments.map((_item: any) => ({
            ..._item,
            _id: new BSON.ObjectID(_item._id),
          }));

          body = {
            ...body,
            delivery: {
              text: data.requestPayment.text,
              email: data.requestPayment.email,
              isDefaultMessage: data.requestPayment.isDefaultMessage,
            },
            payments: tempPayments,
          };
        }

        if (data.requestSignature) {
          body = {
            ...body,
            signature: { ...data.requestSignature },
          };
        } else {
          body = {
            ...body,
            signature: null,
          }
        }

        if (data.customs) {
          body = { ...body, customs: data.customs };
        }

        if (data.note) {
          body = { ...body, note: data.note };
        }

        if (data.attachments) {
          body = { ...body, attachments: data.attachments };
        }

        console.log(body);
        if (body) {
          for (const [key, value] of Object.entries(body)) {
            _invoiceItem[key] = value;
          }
          setHadUpdatedInvoice(true);
        }
      });
    }
  };

  useEffect(() => {
    if (onlinePayments && isCanCreateInvoice && !route.params?.id) {
      onUpdateInvoice({
        requestPayment: {
          payments: [...onlinePayments],
        }
      });
    }
  }, [onlinePayments, isCanCreateInvoice]);

  const send = async () => {
    realm.write(() => {
      const _invoiceItem = realm.objectForPrimaryKey<Invoice>('invoices', route.params?.id);

      if (_invoiceItem) {
        _invoiceItem.status = InvoiceStatus.Unpaid;
        _invoiceItem.date = new Date().toISOString();
        setHadUpdatedInvoice(true);
      }
    });
  };

  const requestPayment = () => {
    if (!isOnlinePayments) {
      showMessage({
        type: 'warning',
        message: 'Please Enable Paypal Payments!',
      });
      return;
    }
    if (formatedInvoice?._id) {
      const body = {
        id: formatedInvoice._id.toString(),
        text: dataForm.delivery?.text,
        email: dataForm.delivery?.email,
        payments: dataForm.payments,
        isDefaultMessage: dataForm.delivery?.isDefaultMessage,
      };
      dispatch(requestPaymentInvoice(body));
      navigation.goBack();
    }
  };

  const changeStatus = async () => {
    try {
      realm.write(() => {
        const _invoiceItem = realm.objectForPrimaryKey<Invoice>('invoices', invoiceId);
        if (_invoiceItem) {
          if (formatedInvoice?.status === InvoiceStatus.Paid) {
            _invoiceItem.status = InvoiceStatus.Unpaid;
            _invoiceItem.paidDate = null;
          } else {
            _invoiceItem.status = InvoiceStatus.Paid;
            _invoiceItem.paidDate = new Date().toISOString();
          }

          setHadUpdatedInvoice(true);
        }
      });
      typeof callback === 'function' && callback();
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onOpenAlertModal = () => {
    navigation.navigate<any>(MainStackRouteNames.AlertModal, {
      message: 'Please mark the invoice UnPaid to request payment.',
    });
  };

  const onRequestPaymentClick = () => {
    navigation.navigate(MainStackRouteNames.RequestPayment, {
      backScreen: MainStackRouteNames.InvoiceSingle,
      returnValueName: 'requestPayment',
      value: { ...formatedInvoice?.delivery },
      invoiceId: formatedInvoice?._id,
      payments: formatedInvoice?.payments.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
      })),
      callback: onUpdateInvoice,
    });
  };

  const onRequestSignatureClick = () => {
    navigation.navigate(MainStackRouteNames.RequestSignature, {
      backScreen: MainStackRouteNames.InvoiceSingle,
      returnValueName: 'requestSignature',
      value: formatedInvoice?.signature,
      callback: onUpdateInvoice,
    });
  };

  const onSelectClient = () => {
    navigation.navigate(MainStackRouteNames.ClientDropDownList, {
      title: 'Select client',
      returnValueName: 'billTo',
      backScreen: MainStackRouteNames.InvoiceSingle,
      selectedValue: formatedInvoice?.billTo || null,
      callback: onUpdateInvoice,
    });
  };

  const onAddDate = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceDate, {
      backScreen: MainStackRouteNames.InvoiceSingle,
      returnValueName: 'date',
      value: dataForm.date,
      callback: onUpdateInvoice,
    });
  };

  const onAddItems = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceItems, {
      backScreen: MainStackRouteNames.InvoiceSingle,
      returnValueName: 'items',
      value: dataForm.items,
      isEstimate: estimate,
      invoiceId,
      callback: onUpdateInvoice,
    });
  };

  // const onAddCustoms = () => {
  //   navigation.navigate(MainStackRouteNames.AddInvoiceNote, {
  //     backScreen: MainStackRouteNames.InvoiceSingle,
  //     returnValueName: 'note',
  //     value: dataForm.customs,
  //     callback: onUpdateInvoice,
  //   });
  // };

  const onAddNote = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceNote, {
      backScreen: MainStackRouteNames.InvoiceSingle,
      returnValueName: 'note',
      value: dataForm.note,
      callback: onUpdateInvoice,
    });
  };

  const onAddAttachments = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceAttachments, {
      backScreen: MainStackRouteNames.InvoiceSingle,
      returnValueName: 'attachments',
      value: dataForm.attachments,
      callback: onUpdateInvoice,
    });
  };

  const onSelectAction = async (action = InvoiceMenuAction.Download) => {
    const { fs, android, ios } = RNFetchBlob;

    const dir = isIOS ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

    setShowDotsPopup(false);
    // setSpinnerFlag(true);

    try {
      const folder = await fs.exists(dir);
      if (!folder) {
        showMessage({
          message: 'Dont have access to folder',
          type: 'danger',
        });
        return;
      }

      const fileName = `INV${invoiceNumber}.pdf`;
      const path = `${dir}/${fileName}`;

      const file = await fs.exists(path);
      setIsLoading(true);
      api
        .get(`/invoices/${invoiceId}/pdf`)
        .then(({ data }) => {
          fs.writeFile(path, data, 'base64');
          // setSpinnerFlag(false);
        })
        .then(async () => {
          setIsLoading(false);
          handleAction(action, path, fileName);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleAction = async (action: InvoiceMenuAction, path: string, fileName: string) => {
    const { fs, android, ios } = RNFetchBlob;
    const mime = 'application/pdf';

    const shareOptions = {
      type: mime,
      url: `file://${path}`,
    };

    try {
      if (isIOS) {
        switch (action) {
          case InvoiceMenuAction.Share:
            await Share.open(shareOptions);
            break;
          case InvoiceMenuAction.Print:
            await RNPrint.print({ filePath: path });
            break;
          default:
            ios.previewDocument(path);
            break;
        }
      } else {
        switch (action) {
          case InvoiceMenuAction.Share:
            await Share.open(shareOptions);
            break;
          case InvoiceMenuAction.Print:
            await RNPrint.print({ filePath: path });
            break;
          default:
            android.addCompleteDownload({
              title: fileName,
              description: 'Invoice downloaded',
              mime,
              path,
              showNotification: true,
            });
            android.actionViewIntent(path, mime);
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const duplicate = () => {
    setShowDotsPopup(false);
    const invoiceData: any = { ...formatedInvoice?.toJSON(), number: null };
    delete invoiceData._id;
    invoiceData.billTo = formatedInvoice?.billTo;
    invoiceData.payments = formatedInvoice?.payments;
    invoiceData.category = formatedInvoice?.category;

    navigation.navigate(MainStackRouteNames.InvoiceCreate, {
      backScreen: MainStackRouteNames.InvoiceSingle,
      invoice: invoiceData,
    });
  };

  const onDeleteInvoice = async () => {
    setShowDotsPopup(false);
    if (formatedInvoice) {
      await dispatch(deleteInvoice({ id: formatedInvoice._id.toString() }));
      typeof callback === 'function' && callback();
      navigation.goBack();
    }
  };

  const _renderItem = ({ item, index }: any, parallaxProps: AdditionalParallaxProps) => {
    return (
      <TouchableOpacity>
        <View style={styles.item}>
          <ParallaxImage
            source={{ uri: item }}
            containerStyle={styles.imageContainer}
            style={styles.attachmentImage}
            parallaxFactor={0.4}
            {...parallaxProps}
          />
        </View>
      </TouchableOpacity>
    );
  };;

  const renderAttachments = () => {
    const { attachments } = dataForm;
    return (
      <View>
        {/* <TouchableOpacity onPress={onAddAttachments}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 24,
              height: 50,
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Text style={styles.label}>Attachments</Text>
            <ArrowRightIcon />
          </View>
        </TouchableOpacity> */}
        {attachments.length === 0 && (
          <FormField
            onPress={onAddAttachments}
            label={'Attachments'}
            containerStyle={styles.field}
            cardFooter={(
              <View style={[styles.cardRowBorderValue, styles.cardRowButton, { backgroundColor: 'rgba(45, 122, 234, 0.1)', paddingHorizontal: 18, paddingVertical: 13 }]}>
                <Text style={{ color: colors.bluePrimary }}>Add Attachments</Text>
                <View style={{ marginRight: 10 }}>
                  <PlusIcon size={16} color={colors.bluePrimary} />
                </View>
              </View>
            )}
          >
          </FormField>
        )}
        {attachments.length > 0 && (
          <FormField
            onPress={onAddAttachments}
            label={'Attachments'}
            containerStyle={styles.fieldNoBorder}
            cardFooter={(
              <View style={[styles.cardRowBorderValue, styles.cardRowButton, { marginTop: 8, backgroundColor: 'rgba(45, 122, 234, 0.1)', paddingHorizontal: 18, paddingVertical: 13 }]}>
                <Text style={{ color: colors.bluePrimary }}>Add Attachments</Text>
                <View style={{ marginRight: 10 }}>
                  <PlusIcon size={16} color={colors.bluePrimary} />
                </View>
              </View>
            )}
          >
            {attachments.map((_: any, key: number) => (
              <Text style={styles.cardRowBorderValue} key={`attachment_${key + 1}`}>Attachment #{key + 1}</Text>
            ))}
          </FormField>
        )}
        {/* <Carousel
          sliderWidth={SCREEN_WIDTH}
          sliderHeight={SCREEN_WIDTH / 2}
          itemWidth={SCREEN_WIDTH / 2 - 60}
          data={formatedInvoice?.attachments || []}
          renderItem={_renderItem}
          hasParallaxImages={true}
        /> */}
      </View>
    );
  };

  const getContent = () => {
    const categoryItems = (formatedInvoice?.items || []).map((i: any) => i.description).join(', ');
    const payments = (formatedInvoice?.payments || []).map((p: any) => p.name).join(', ');
    const customs = (formatedInvoice?.customs || []).map((c: any) => c.name).join(', ');
    const note = formatedInvoice?.note;

    return (
      <ScrollView style={styles.scrollContainer}>
        <Spinner
          visible={spinnerFlag}
        // textContent={'Loading...'}
        // textStyle={styles.spinnerTextStyle}
        />
        <FormField label={'Invoice #'} containerStyle={styles.field}>
          <Text style={styles.cardRowValue}>{formatedInvoice?.number}</Text>
        </FormField>
        <FormField onPress={onAddDate} label={'Date'} containerStyle={styles.field} isClickable={true}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Invoice Date</Text>
            <Text style={styles.cardRowValue}>
              {formatedInvoice?.date ? moment(formatedInvoice?.date).format('MMM/DD/YYYY') : moment().format('MMM/DD/YYYY')}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Due date</Text>
            <Text style={styles.cardRowValue}>
              {formatedInvoice?.dueDate
                ? moment(formatedInvoice?.dueDate).format('MMM/DD/YYYY')
                : moment().format('MMM/DD/YYYY')}
            </Text>
          </View>
          {Boolean(formatedInvoice?.recurringPeriod) && (
            <View style={styles.cardRow}>
              <Text style={styles.cardRowLabel}>Recurring period</Text>
              <Text style={styles.cardRowValue}>
                Every {formatedInvoice?.recurringPeriod} months
              </Text>
            </View>
          )}
        </FormField>
        <FormField onPress={onSelectClient} label={'Bill To'} containerStyle={styles.field} isClickable={true}>
          <Text style={styles.cardRowValue}>{formatedInvoice?.billTo?.name || '-'}</Text>
        </FormField>
        <FormField
          onPress={onAddItems}
          label={'Items'}
          containerStyle={styles.field}
          cardFooter={(
            <View style={[styles.cardRowBorderValue, styles.cardRowButton, { marginTop: 8, backgroundColor: 'rgba(45, 122, 234, 0.1)', paddingHorizontal: 18, paddingVertical: 13 }]}>
              <Text style={{ color: colors.gray }}>Select/Add Items</Text>
              <View>
                <ChevronRightIcon size={24} color={colors.gray} />
              </View>
            </View>
          )}
        >
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Category</Text>
            <Text style={styles.cardRowValue}>{formatedInvoice?.category?.name || '-'}</Text>
          </View>
          {formatedInvoice?.items.filter((item) => item.selected).map((item, index) => (
            <View style={styles.cardRow} key={`single_item_${index}`}>
              <Text style={styles.cardRowLabel}>{index + 1}. {item.description}</Text>
              <Text style={styles.cardRowValue}>${Number(item.rate).toFixed(2)} X {item.hours}</Text>
            </View>
          ))}
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Discount</Text>
            <Text style={styles.cardRowValue}>
              {formatedInvoice?.discountRate || 0}%, {formatedInvoice?.discount || 0}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Tax</Text>
            <Text style={styles.cardRowValue}>{formatedInvoice?.taxRate || 0}%</Text>
          </View>
          {!estimate && (
            <View style={styles.cardRow}>
              <Text style={styles.cardRowLabel}>Deposit</Text>
              <Text style={styles.cardRowValue}>
                {currencyFormatter.format(Number(formatedInvoice?.deposit) || 0)}
              </Text>
            </View>
          )}
          <View style={[styles.cardRow, styles.borderRow]}>
            <Text style={styles.cardRowLabel}>Total</Text>
            <Text style={styles.cardRowValue}>${formatedInvoice?.total || 0}</Text>
          </View>
        </FormField>
        {/* <FormField onPress={onRequestPaymentClick} label={'Payment Method'} containerStyle={styles.field} isClickable={true}>
          <Text style={styles.cardRowValue}>{payments ? payments : 'Payment Method'}</Text>
        </FormField> */}
        <FormField onPress={onRequestSignatureClick} label={'Signature'} containerStyle={styles.field} isClickable={true}>
          <Text style={styles.cardRowValue}>{formatedInvoice?.signature ? 'Signed on ' + moment(formatedInvoice.signature?.createdAt).format('YYYY-MM-DD HH:mm:ss') : 'Signature'}</Text>
        </FormField>
        <FormField onPress={onAddNote} label={'Note'} containerStyle={styles.field} isClickable={true}>
          <Text style={styles.cardRowValue}>{formatedInvoice?.note?.length ? note : 'Add instruction here'}</Text>
        </FormField>
        {renderAttachments()}
        <View style={styles.actionsContainer}>
          {formatedInvoice?.status === InvoiceStatus.Estimate && (
            <Button text={'Convert to Invoice'} onPress={send} type={BtnType.Primary} />
          )}
          {formatedInvoice?.status !== InvoiceStatus.Estimate && (
            <>
              {/* <Button
                text={'Request Payment'}
                onPress={unpaidInvoice ? requestPayment : onOpenAlertModal}
                type={BtnType.Primary}
                containerStyle={styles.actionButton}
              /> */}
              <Button
                text={'Preview'}
                onPress={() => setActiveTab('Preview')}
                type={BtnType.Primary}
                containerStyle={styles.actionButton}
              />
              <Button
                text={
                  formatedInvoice?.status === InvoiceStatus.Paid ? 'Mark as UnPaid' : 'Mark as Paid'
                }
                onPress={changeStatus}
                type={
                  formatedInvoice?.status === InvoiceStatus.Paid
                    ? BtnType.GreenPrimary
                    : BtnType.Outlined
                }
              />
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {showDotsPopup && (
        <>
          <TouchableWithoutFeedback onPress={() => setShowDotsPopup(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.dotsDetailsContainer,
              commonView.commonShadow,
              {
                top: 60 + insets.top,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectAction(InvoiceMenuAction.Share)}
              style={[styles.dotsDetailsItem, styles.dotsDetailsItemWithoutBorder]}
            >
              <>
                <Text style={styles.dotsDetailsItemText}>Share PDF</Text>
                <ShareIcon />
              </>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectAction(InvoiceMenuAction.Download)}
              style={[styles.dotsDetailsItem, styles.dotsDetailsItemWithoutBorder]}
            >
              <Text style={styles.dotsDetailsItemText}>Download</Text>
              <DownloadIcon />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectAction(InvoiceMenuAction.Print)}
              style={[styles.dotsDetailsItem, styles.dotsDetailsItemWithoutBorder]}
            >
              <Text style={styles.dotsDetailsItemText}>Print</Text>
              <PrinterIcon />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onDeleteInvoice();
              }}
              style={[styles.dotsDetailsItem, styles.dotsDetailsItemWithoutBorder]}
            >
              <Text style={styles.dotsDetailsItemText}>Delete</Text>
              <TrashIcon />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                duplicate();
              }}
              activeOpacity={0.7}
              style={styles.dotsDetailsItem}
            >
              <Text style={styles.dotsDetailsItemText}>Duplicate</Text>
              <DuplicateIcon />
            </TouchableOpacity>
          </View>
        </>
      )}
      <LoadingOverlay visible={isLoading} />
      <Header
        title={title}
        showBackBtn={true}
        rightSideComponent={
          <TouchableOpacity
            onPress={() => setShowDotsPopup((state) => !state)}
            style={[styles.dotsContainer]}
          >
            <DotsIcon />
          </TouchableOpacity>
        }
        onBackPress={() => {
          if (shouldDeleteInvoice) {
            realm.write(() => {
              realm.delete(formatedInvoice);
            });
          }
          navigation.goBack();
        }}
      >
        <CustomTabs tabs={TABS} active={activeTab} setActiveTab={(e) => setActiveTab(e)} />
      </Header>
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: activeTab !== 'Preview' ? -16 : -30,
          paddingTop: 12,
          flex: 1,
        }}
      >
        {activeTab !== 'Preview' ? (
          <PageContainer roundLeftTopBorder={false}>{getContent()}</PageContainer>
        ) : (
          <>
            <ScrollView>
              <View>
                <CustomInvoice data={customData} />
              </View>
            </ScrollView>
            <View style={styles.btnSection}>
              <TouchableOpacity onPress={() => onSelectAction(InvoiceMenuAction.Share)}>
                <View style={styles.btnRow}>
                  <ShareIcon color={colors.bluePrimary} />
                  <Text style={styles.btnRowText}>Share PDF</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onRequestPaymentClick}>
                <View style={styles.btnRow}>
                  <PlusIcon color={colors.bluePrimary} />
                  <Text style={styles.btnRowText}>Request Payment</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={changeStatus}>
                <View style={styles.btnRow}>
                  <FastImage source={require('../assets/images/mark.png')} style={{ width: 25, height: 25 }} />
                  <Text style={styles.btnRowText}>{formatedInvoice?.status === InvoiceStatus.Paid ? 'Mark as UnPaid' : 'Mark as Paid'}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Invoice')}>
                <View style={styles.btnRow}>
                  <EditIcon color={colors.bluePrimary} />
                  <Text style={styles.btnRowText}>Edit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollContainer: {
    flex: 1,
    // paddingVertical: 15,
  },
  field: {
    marginBottom: 24,
  },
  fieldNoBorder: {
    paddingHorizontal: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  borderRow: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    marginTop: 5,
    paddingTop: 5,
  },
  cardRowLabel: {
    flex: 1,
    ...font(14, 21),
    color: colors.text.darkGrayText,
  },
  cardRowValue: {
    flex: 1,
    ...font(14, 21, '300'),
    color: colors.text.darkGrayText,
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
  actionsContainer: {
    marginTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  actionButton: {
    marginBottom: 20,
  },
  bottomActionButton: {
    marginBottom: 5,
    flex: 1,
    width: width / 2 - 25,
  },
  imagesContainer: {
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    paddingHorizontal: 18,
  },
  imageBlock: {
    width: '50%',
    paddingHorizontal: 6,
  },
  image: {
    width: '100%',
    height: 200,
  },
  dotsContainer: {
    width: 30,
    height: 30,
    transform: [{ rotate: '90deg' }],
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
    minWidth: 130,
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
    color: colors.text.darkGrayText,
    ...font(14, 16),
  },
  item: {
    width: SCREEN_WIDTH / 2 - 60,
    height: SCREEN_WIDTH / 2 - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  attachmentImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  label: {
    ...font(16, 24),
    marginBottom: 8,
    // paddingHorizontal: 24,
    color: colors.text.grayText,
  },
  btnRow: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  btnRowText: {
    fontSize: 12,
    marginTop: 5,
    color: colors.bluePrimary,
  },
  btnSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
});
