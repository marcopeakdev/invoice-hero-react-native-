import React, {useEffect, useRef} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {MainStackRouteNames} from '../navigation/router-names';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {BtnType, Button} from '../components/Button';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {InputField} from '../components/form/InputField';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoiceDelivery>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddInvoiceDelivery
  >;
};

const initialValues = {
  email: '',
  text: '',
  sharedLink: '',
};

// const validationSchema = Yup.object().shape({
//   email: Yup.string().email().required(),
//   text: Yup.string().required(),
//   sharedLink: Yup.string(),
// });

export const AddInvoiceDelivery: React.FC<Props> = ({route, navigation}) => {
  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }
  }, [route]);

  const onSave = (values: any): void => {
    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: values,
    });
  };

  const onCancel = () => {
    navigation.navigate<any>(backScreen.current);
  };

  return (
    <View style={styles.container}>
      <Header title={'Add Delivery'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={route.params?.value || initialValues}
          validateOnMount={true}
          // validationSchema={validationSchema}
          onSubmit={onSave}>
          {({isValid, handleSubmit}) => (
            <>
              <ScrollView style={styles.container}>
                <InputField
                  label={'Email'}
                  name={'email'}
                  containerStyle={styles.field}
                />
                <InputField
                  label={'Text message'}
                  name={'text'}
                  containerStyle={styles.field}
                />
                <InputField
                  label={'Shared Link'}
                  name={'sharedLink'}
                  containerStyle={styles.field}
                />
              </ScrollView>
              <View
                style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
                <Button
                  text={'Save'}
                  containerStyle={styles.action}
                  onPress={handleSubmit}
                  disabled={!isValid}
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
});
