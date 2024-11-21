import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthLayout } from '../components/AuthLayout';
import { BtnType, Button } from '../components/Button';
import { colors } from '../styles/colors';
import { commonText } from '../styles/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthRouterParamList } from '../navigation/AuthStackNavigator';
import { font } from '../styles/font';
import { InputField } from '../components/form/InputField';
import { api, ApiRequestEnum } from '../utils/api';
import { AxiosError } from 'axios';
import { showMessage } from 'react-native-flash-message';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { AuthStackNavigatorName } from '../navigation/router-names';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const initialValues = {
  email: '',
};

type Props = {
  navigation: NativeStackNavigationProp<AuthRouterParamList>;
};


const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirm: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export const ForgotPassword: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();


  const onOpenAlertModal = (email: string) => {
    navigation.navigate<any>(AuthStackNavigatorName.AlertModal, {
      message: `We will send you an email confirmation confirming its really you!`,
      callback: () => {
        navigation.goBack();
      }
    });
  };

  const onSubmit = async (values: any) => {
    try {
      onOpenAlertModal(values.email);
      const data = await api.post(ApiRequestEnum.RESET_PASSWORD, {
        email: values.email,
        password: values.password,
      });
      if (data.status !== 200) {
        showMessage({
          message: 'Reset Password Fail!',
          type: 'danger',
        });
      }
    } catch (e: AxiosError | any) {
      if (e) {
        showMessage({
          message:
            e.response.data?.error ||
            e.response.data?.message ||
            e.response.data ||
            'Error happens. Please check your internet connection or try again later',
          type: 'danger',
        });
      }
    }

  };

  return (
    <AuthLayout>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
      >
        <View style={styles.topBlock}>
          <Text style={styles.pageTitle}>Reset password</Text>
          <Text style={commonText.paragraphText}>
            We will send you an email with a link to reset your password
          </Text>
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnMount={true}
        >
          {({ handleSubmit, isValid }) => (
            <>
              <View style={styles.formContainer}>
                <InputField
                  label={'Email'}
                  name={'email'}
                  placeholder={'Enter email...'}
                  containerStyle={styles.field}
                  keyboardType='email-address'
                  textInputProps={{
                    autoCapitalize: 'none'
                  }}
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
              </View>
              <View style={styles.actionContainer}>
                <Button
                  text={'Reset Password'}
                  onPress={handleSubmit}
                  containerStyle={{ marginBottom: 16 }}
                  disabled={!isValid}
                />
                <Button
                  text={'Cancel'}
                  type={BtnType.Outlined}
                  onPress={() => navigation.goBack()}
                />
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  topBlock: {
    paddingHorizontal: 24,
  },
  pageTitle: {
    ...font(24, 36, '600'),
    color: colors.bluePrimary,
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 10,
  },
  actionContainer: {
    paddingHorizontal: 24,
  },
});
