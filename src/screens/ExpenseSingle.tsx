import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { RouteProp } from '@react-navigation/native';
import { MainBottomTabsRouteNames, MainStackRouteNames } from '../navigation/router-names';
import LinearGradientComponent from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { colors, gradients } from '../styles/colors';
import { FormField } from '../components/FormField';
import { BtnType, Button } from '../components/Button';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { ScanIcon } from '../components/icons/ScanIcon';
import { Expense } from '../models/expense';
import { font } from '../styles/font';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
// import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';
import { selectUser } from '../store/selectors/user';
import Spinner from 'react-native-loading-spinner-overlay';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import { ExpenseSchema } from '../database/ExpenseSchema';
import { deleteExpense } from '../store/thunk/expenses';
import { isIOS } from '../utils/constants';
import { getFileNameFromUri } from '../utils/files';
import { api, ApiRequestEnum } from '../utils/api';
import { PlusIcon } from '../components/icons/PlusIcon';

const { useRealm, useQuery, useObject } = RealmContext;

const width = Dimensions.get('window').width;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.ExpenseSingle>;
  navigation: NativeStackNavigationProp<MainStackParamList, MainStackRouteNames.ExpenseSingle>;
};

const formatExpenseToForm = (expense: any) => {
  let result = {
    purpose: expense?.purpose,
    merchant: expense?.merchant || '',
    attachments: expense?.attachments || [],
    date: {
      date: expense?.date || new Date(),
    },
    items: {
      deposit: expense?.deposit || 0,
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

export const ExpenseSingle: React.FC<Props> = ({ route, navigation }) => {
  const [hadUpdatedExpense, setHadUpdatedExpense] = useState(false);
  const [spinnerFlag, setSpinnerFlag] = useState(false);
  // Loading Screen management
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<any>();
  const callback = route.params?.callback;

  const user = useSelector(selectUser);

  const realm = useRealm();
  const shouldDeleteExpense = useMemo(() => {
    return !route.params?.id && !hadUpdatedExpense;
  }, [hadUpdatedExpense, route.params?.id]);

  const formatedExpenseId = useMemo(() => {
    let _expenseId;
    if (route.params?.id) {
      _expenseId = route.params?.id;
    } else {
      realm.write(() => {
        const schema = ExpenseSchema.generate({
          items: [],
          attachments: route.params?.image ? [route.params?.image] : [],
          purpose: '',
          user: user?._id,
          date: new Date(),
        });
        const _expense = realm.create<Expense>(
          'expenses',
          schema
        );
        _expenseId = _expense?._id;
      });
    }
    return new BSON.ObjectID(_expenseId);
  }, [route.params?.id]);

  const formatedExpense = useObject<Expense>('expenses', formatedExpenseId);
  const [selectedImage, setSelectedImage] = useState(formatedExpense?.attachments && formatedExpense?.attachments[0] ? formatedExpense?.attachments[0] : '');

  const dataForm = useMemo(() => {
    return formatExpenseToForm(formatedExpense);
  }, [formatedExpense, hadUpdatedExpense]);

  const [purpose, setPurpose] = useState(dataForm?.purpose ?? '');

  const expenseId: any = useMemo(() => {
    return formatedExpense?._id;
  }, [formatedExpense]);

  const onUpdateExpense = (data: any) => {
    console.log(expenseId);
    const _expenseItem: any = realm.objectForPrimaryKey<Expense>('expenses', expenseId);
    if (_expenseItem) {
      realm.write(() => {
        let body: any = {};
        if (data.billTo || data.billTo === null) {
          body = { merchant: data.billTo };
        }

        if (data.date) {
          body = { ...body, ...data.date };
        }

        if (data.purpose) {
          body = { ...body, purpose: data.purpose };
        }

        if (data.items) {
          body = { ...body, ...data.items };
        }

        if (data.attachments) {
          body = { ...body, attachments: data.attachments };
        }

        if (body) {
          for (const [key, value] of Object.entries(body)) {
            _expenseItem[key] = value;
          }
          setHadUpdatedExpense(true);
        }
      });
    }
  };

  const onSelectClient = () => {
    navigation.navigate(MainStackRouteNames.ClientDropDownList, {
      title: 'Select client',
      returnValueName: 'merchant',
      backScreen: MainStackRouteNames.ExpenseSingle,
      selectedValue: formatedExpense?.merchant || null,
      callback: onUpdateExpense,
    });
  };

  const onAddDate = () => {
    navigation.navigate(MainStackRouteNames.AddExpenseDate, {
      backScreen: MainStackRouteNames.ExpenseSingle,
      returnValueName: 'date',
      value: dataForm.date,
      callback: onUpdateExpense,
    });
  };

  const onAddItems = () => {
    navigation.navigate(MainStackRouteNames.AddExpenseItems, {
      backScreen: MainStackRouteNames.ExpenseSingle,
      returnValueName: 'items',
      value: dataForm.items,
      expenseId,
      callback: onUpdateExpense,
    });
  };

  const renderAttachments = () => {
    return (
      <View>
        <FormField
          onPress={handleScan}
          label={'Attachments'}
          containerStyle={styles.field}
          cardFooter={selectedImage ? (
            <FastImage source={{ uri: selectedImage }} style={{ height: 200 }} />
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <PlusIcon />
              <Text style={{ marginLeft: 10, color: colors.gray }}>Attach Receipt</Text>
            </View>
          )}
        >
        </FormField>
      </View>
    );
  };

  const handlePurpose = (value: string) => {
    setPurpose(value);
  };

  const handleSave = () => {
    onUpdateExpense({
      purpose: purpose,
    });
    navigation.navigate(MainBottomTabsRouteNames.Expenses);
  };

  const handleDelete = async () => {
    if (formatedExpense) {
      await dispatch(deleteExpense({ id: formatedExpense._id.toString() }));
      typeof callback === 'function' && callback();
      navigation.goBack();
    }
  };

  const uploadFile = async (asset: any) => {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: isIOS ? asset.path.replace('file://', '') : asset.path,
        name: getFileNameFromUri(asset.path),
        type: asset.type || 'image/jpeg',
      });

      const result = await api.post(ApiRequestEnum.ATTACHMENTS_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return result.data.Location;
    } catch (e) {
      return '';
    }
  };

  const handleScan = () => {
    ImagePicker.openCamera({
      cropping: true,
      showCropFrame: true,
    }).then(async (image) => {
      const fileLocation = await uploadFile(image);
      onUpdateExpense({
        attachments: [fileLocation],
      });
      setSelectedImage(fileLocation);
    });

    // ImagePicker.openPicker({
    //   cropping: true,
    // }).then(async (image) => {
    //   const fileLocation = await uploadFile(image);
    //   onUpdateExpense({
    //     attachments: [fileLocation],
    //   });
    // });
  };

  const getContent = () => {
    return (
      <ScrollView style={styles.scrollContainer}>
        <Spinner
          visible={spinnerFlag}
        // textContent={'Loading...'}
        // textStyle={styles.spinnerTextStyle}
        />
        {renderAttachments()}
        <FormField label={'Expense Purpose'} containerStyle={styles.field}>
          <TextInput
            onChangeText={handlePurpose}
            style={styles.input}
            placeholder={'Purpose'}
            placeholderTextColor={colors.gray}
            value={purpose}
          />
        </FormField>
        <FormField onPress={onAddDate} label={'Date'} containerStyle={styles.field} isClickable={true}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Date</Text>
            <Text style={styles.cardRowValue}>
              {formatedExpense?.date ? moment(formatedExpense?.date).format('MMM/DD/YYYY') : moment().format('MMM/DD/YYYY')}
            </Text>
          </View>
        </FormField>
        <FormField onPress={onSelectClient} label={'Merchant Name'} containerStyle={styles.field} isClickable={true}>
          <Text style={styles.cardRowValue}>{formatedExpense?.merchant?.name || '-'}</Text>
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
          {(formatedExpense?.items || []).filter((item) => item.selected).map((item, index) => (
            <View style={styles.cardRow} key={`single_item_${index}`}>
              <Text style={styles.cardRowLabel}>{index + 1}. {item.description}</Text>
              <Text style={styles.cardRowValue}>${Number(item.rate).toFixed(2)} X {item.hours}</Text>
            </View>
          ))}
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Discount</Text>
            <Text style={styles.cardRowValue}>
              {formatedExpense?.discountRate || 0}%, {formatedExpense?.discount || 0}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Tax</Text>
            <Text style={styles.cardRowValue}>{formatedExpense?.taxRate || 0}%</Text>
          </View>
          <View style={[styles.cardRow, styles.borderRow]}>
            <Text style={styles.cardRowLabel}>Total</Text>
            <Text style={styles.cardRowValue}>${formatedExpense?.total || 0}</Text>
          </View>
        </FormField>
        <View style={styles.actionsContainer}>
          <Button
            text={'Save'}
            onPress={handleSave}
            type={BtnType.Primary}
            containerStyle={styles.actionButton}
          />
          <Button
            text={'Delete'}
            onPress={handleDelete}
            type={BtnType.Outlined}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      <Header
        title={'Preview New Expense'}
        showBackBtn={true}
        onBackPress={() => {
          navigation.navigate(MainBottomTabsRouteNames.Expenses);
        }}
      >
      </Header>
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: -16,
          paddingTop: 12,
          flex: 1,
        }}
      >
        <PageContainer roundLeftTopBorder={false}>{getContent()}</PageContainer>
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
  input: {
    flex: 1,
    marginLeft: 6,
    // ...font(14, 16, '500'),
    color: colors.text.grayText,
  },
});
