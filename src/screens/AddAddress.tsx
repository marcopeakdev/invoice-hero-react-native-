import React, {useEffect} from 'react';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {Formik, useFormikContext} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {InputField} from '../components/form/InputField';
import {FormField} from '../components/FormField';
import {BtnType, Button} from '../components/Button';
import {commonView} from '../styles/common';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddAddress>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddAddress
  >;
};

const AddAddressForm: React.FC<Props> = ({route, navigation}) => {
  const formik = useFormikContext<any>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params.value) {
      formik.setValues({
        ...route.params.value,
        country: 'USA',
      });
    }
  }, [route.params.value]);

  const onCancel = () => {
    if (route.params.backScreen) {
      navigation.navigate<any>(route.params.backScreen);
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <InputField
        label={'Street Address'}
        name={'street'}
        placeholder={'Enter street address...'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Apt/Suite'}
        placeholder={'Enter apt/suite...'}
        name={'apt'}
        containerStyle={styles.field}
      />
      <InputField
        label={'City'}
        placeholder={'Enter city...'}
        name={'city'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Zip Code'}
        placeholder={'Enter zip code...'}
        name={'zip'}
        containerStyle={styles.field}
      />
      <FormField label={'Country'} containerStyle={styles.field}>
        <View style={styles.row}>
          <View style={styles.rowValueContainer}>
            <Text style={commonView.cardRowValue}>{formik.values.country}</Text>
          </View>
        </View>
      </FormField>
      <View style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
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
  street: '',
  apt: '',
  city: '',
  state: '',
  country: 'USA',
  zip: '',
};

export const AddAddress: React.FC<Props> = props => {
  const {route, navigation} = props;

  const onSubmit = (values: any) => {
    if (route.params.backScreen) {
      navigation.navigate<any>(route.params.backScreen, {
        [route.params.returnValueName]: values,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Add Address'} showBackBtn={true} />
      <PageContainer>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <AddAddressForm {...props} />
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
