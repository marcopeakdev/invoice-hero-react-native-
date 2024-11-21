import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { Formik, useFormikContext } from 'formik';
import { RouteProp } from '@react-navigation/native';
import {
  SettingsStackRouteNames,
} from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingRouterParamList } from '../navigation/SettingsStackNavigator';
import { InputField } from '../components/form/InputField';
import { isIOS } from '../utils/constants';
import { api, ApiRequestEnum } from '../utils/api';
import { getFileNameFromUri } from '../utils/files';
import { colors } from '../styles/colors';
import { Button } from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { createUserBusiness, getUserBusiness, updateUserBusiness } from '../store/thunk/business';
import { selectBusiness } from '../store/selectors/business';
import { selectUser } from '../store/selectors/user';
import DocumentPicker, {
  types,
} from 'react-native-document-picker';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomCard } from '../components/CustomCard';
import { EditIcon } from '../components/icons/EditIcon';
import FastImage from 'react-native-fast-image';
import { CloseIcon } from '../components/icons/CloseIcon';

type Props = {
  route: RouteProp<
    SettingRouterParamList,
    SettingsStackRouteNames.BusinessInfo
  >;
  navigation: NativeStackNavigationProp<
    SettingRouterParamList,
    SettingsStackRouteNames.BusinessInfo
  >;
  isLoading: boolean;
};

const BusinessForm: React.FC<Props> = React.memo(({ route, navigation, isLoading }) => {
  const dispatch = useDispatch<any>();

  const formik = useFormikContext<any>();
  const business = useSelector(selectBusiness);
  const user = useSelector(selectUser);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const handleImport = async () => {
    try {
      const res = await DocumentPicker.pick({
        // @ts-ignore
        presentationStyle: 'fullScreen',
        allowMultiSelection: false,
        type: [types.images],
      });
      setSelectedFiles((state) => {
        return [...state, ...(res || [])];
      });
      formik.setValues({
        ...formik.values,
        logoFiles: res,
        isDeleteLogo: false,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // ignore
      } else {
        console.error(err);
      }
    }
  }

  const clearLogo = () => {
    setSelectedFiles([]);
    formik.setValues({
      ...formik.values,
      logoFiles: [],
      isDeleteLogo: true,
    });
  }

  useEffect(() => {
    dispatch(getUserBusiness());
  }, []);

  useEffect(() => {
    if (business.result) {
      let data: any = {
        ...business.result,
        payments: (business.result.payments || []).map(payment => payment._id),
        tax: {
          rate: String(business.result?.tax?.rate || 0),
          cost: String(business.result?.tax?.cost || 0),
        },
      };
      if (!data.email) {
        data.email = user?.email;
      }
      formik.setValues(data);
      if (business.result?.logo) {
        setSelectedFiles([{ uri: business.result?.logo }])
      }
    }
  }, [business.result]);

  if (business.loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={colors.bluePrimary} />
      </View>
    );
  }

  return (
    <>
      <CustomCard
        title="Business Logo"
      >
        <TouchableOpacity onPress={handleImport}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {!selectedFiles.length && (
              <EditIcon />
            )}
            {selectedFiles.length > 0 && (
              <View style={{ position: 'relative', width: '100%' }}>
                <FastImage
                  source={{ uri: selectedFiles[0].uri }}
                  style={{ width: '100%', height: 120 }}
                  resizeMode={'contain'}
                />
                <TouchableOpacity
                  onPress={() => clearLogo()}
                  activeOpacity={0.9}
                  style={{ position: 'absolute', right: -10, top: -10 }}
                >
                  <CloseIcon color={colors.gray} size={16} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </CustomCard>
      <InputField
        name={'name'}
        placeholder={'Business name'}
        containerStyle={styles.field}
      />
      <InputField
        name={'ownerName'}
        placeholder={'Business Owner Name'}
        containerStyle={styles.field}
      />
      <InputField
        name={'number'}
        placeholder={'Business Number'}
        containerStyle={styles.field}
      />

      <InputField
        name={'address.street'}
        placeholder={'Address Line 1'}
        containerStyle={styles.topField}
      />
      <InputField
        name={'address.apt'}
        placeholder={'Address Line 2'}
        containerStyle={styles.field}
      />
      <InputField
        name={'address.city'}
        placeholder={'Address Line 3'}
        containerStyle={styles.field}
      />
      <InputField
        name={'email'}
        placeholder={'Email'}
        containerStyle={styles.topField}
        keyboardType="email-address"
      />
      <InputField
        name={'phoneNumber'}
        placeholder={'Phone'}
        containerStyle={styles.field}
        keyboardType="phone-pad"
      />
      <InputField
        name={'website'}
        placeholder={'Website'}
        containerStyle={styles.field}
      />
      <View style={[styles.actions, { paddingBottom: 26 }]}>
        <Button
          text={'Save'}
          containerStyle={styles.action}
          onPress={formik.handleSubmit}
          disabled={!formik.isValid}
          loading={isLoading}
        />
      </View>
    </>
  );
});

const initialValues = {
  name: '',
  ownerName: '',
  email: '',
  website: '',
  phoneNumber: '',
  number: '',
  tax: {
    rate: '0',
    cost: '0',
  },
  address: {
    apt: '',
    street: '',
    city: ''
  },
  payments: [],
}

export const BusinessInfo: React.FC<Props> = props => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const uploadFile = async (asset: any) => {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: isIOS ? asset.uri.replace('file://', '') : asset.uri,
        name: getFileNameFromUri(asset.uri),
        type: asset.type || 'image/jpeg',
      });

      console.log('formData', formData);
      const result = await api.post(ApiRequestEnum.BUSINESS_LOGO_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (result) {
        return result.data?.Location || '';
      } else {
        return '';
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const onSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      if (values?.logoFiles && values.logoFiles.length > 0) {
        const uploadedUrl = await uploadFile(values?.logoFiles[0]);
        values.logo = uploadedUrl;
        delete values?.logoFiles;
      }
      if (values?.isDeleteLogo){
        values.logo = '';
      }
      delete values.isDeleteLogo;
      if (values?._id) {
        await dispatch(updateUserBusiness(
          {
            ...values,
            user: user?._id,
          },
        ))

        showMessage({
          message: 'Business Info updated',
          type: 'success',
        });
      } else {
        await dispatch(createUserBusiness(
          {
            ...values,
            user: user?._id,
          }
        ))

        showMessage({
          message: 'Business Info created',
          type: 'success',
        });
      }
      setIsLoading(false)
      props.navigation.goBack()
    } catch (e: any) {
      console.log(e);
      showMessage({
        message:
          e.response.data?.error ||
          e.response.data?.message ||
          'Error happens',
        type: 'danger',
      });
      setIsLoading(false)
    }

  };

  return (
    <View style={styles.container}>
      <Header title={'Business Info'} showBackBtn={true} />
      <PageContainer>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          viewIsInsideTabBar={true}
        >
          <Formik
            initialValues={initialValues}
            validateOnMount={true}
            onSubmit={onSubmit}>
            <BusinessForm {...props} isLoading={isLoading} />
          </Formik>
        </KeyboardAwareScrollView>
      </PageContainer>
    </View >
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
  topField: {
    marginTop: 22,
    marginBottom: 4,
  },
  field: {
    marginBottom: 4,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
