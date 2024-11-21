import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import * as Yup from 'yup';
import {InputField} from '../components/form/InputField';
import {BtnType, Button} from '../components/Button';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SettingRouterParamList} from '../navigation/SettingsStackNavigator';
import {api, ApiRequestEnum} from '../utils/api';
import {showMessage} from 'react-native-flash-message';
import {AxiosError} from 'axios';

const initialValues = {
  currentPassword: '',
  password: '',
  confirm: '',
};

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required(),
  password: Yup.string().required(),
  confirm: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

type Props = {
  navigation: NativeStackNavigationProp<SettingRouterParamList>;
};

export const ChangePassword: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const onSave = async (values: any) => {
    try {
      const {data} = await api.put(ApiRequestEnum.CHANGE_PASSWORD, {
        currentPassword: values.currentPassword,
        password: values.password,
      });

      navigation.goBack();
    } catch (e: AxiosError | any) {
      if (e) {
        showMessage({
          message:
            e.response.data?.error ||
            e.response.data?.message ||
            'Error happens',
          type: 'danger',
        });
        console.log(e.response.data.error);
      }
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title={'Change password'} showBackBtn={true} />
      <PageContainer>
        <ScrollView style={styles.scrollContainer}>
          <Formik
            initialValues={initialValues}
            validateOnMount={true}
            validationSchema={validationSchema}
            onSubmit={onSave}>
            {({isValid, handleSubmit}) => (
              <>
                <ScrollView style={styles.container}>
                  <InputField
                    label={'Current password'}
                    name={'currentPassword'}
                    placeholder={'Enter current password...'}
                    containerStyle={styles.field}
                    secureTextEntry={true}
                  />
                  <InputField
                    label={'New password'}
                    name={'password'}
                    placeholder={'Enter new password...'}
                    containerStyle={styles.field}
                    secureTextEntry={true}
                  />
                  <InputField
                    label={'Confirm new password'}
                    name={'confirm'}
                    placeholder={'Confirm your password...'}
                    containerStyle={styles.field}
                    secureTextEntry={true}
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
        </ScrollView>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  field: {
    marginBottom: 24,
  },
  actions: {
    paddingHorizontal: 24,
  },
  action: {
    marginTop: 16,
  },
});
