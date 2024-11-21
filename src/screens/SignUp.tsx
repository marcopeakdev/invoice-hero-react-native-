import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Formik } from 'formik';
import SafariView from 'react-native-safari-view';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { colors } from '../styles/colors';
import { AuthStackNavigatorName } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthRouterParamList } from '../navigation/AuthStackNavigator';
import { font } from '../styles/font';
import { InputField } from '../components/form/InputField';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { selectSignUp } from '../store/selectors/user';
import { signUp } from '../store/thunk/user';
import { resetSignUp } from '../store/reducers/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('Required Field'),
  password: Yup.string().required('Required Field'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

type Props = {
  navigation: NativeStackNavigationProp<AuthRouterParamList>;
};

export const SignUp: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<any>();
  const signUpStore = useSelector(selectSignUp);

  const onSubmit = (values: any): any => {
    dispatch(signUp(values));
  };

  useEffect(() => {
    if (signUpStore.success) {
      navigation.navigate(AuthStackNavigatorName.SignIn);
    }
  }, [signUpStore.success]);

  useEffect(() => {
    return () => dispatch(resetSignUp());
  }, []);

  const openURL = (url: string) => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  const openTermsURL = () => {
    if (Platform.OS === 'ios') {
      openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')
    } else {
      navigation.navigate(AuthStackNavigatorName.Terms);
    }
  }

  return (
    <AuthLayout>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
      >
        <Text style={styles.pageTitle}>Sign Up</Text>
        <Formik
          initialValues={initialValues}
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ handleSubmit, isValid }) => (
            <>
              <View style={styles.formContainer}>
                <InputField
                  label={'Email'}
                  name={'email'}
                  containerStyle={styles.field}
                  keyboardType='email-address'
                  textInputProps={{
                    autoCapitalize: 'none'
                  }}
                />
                <InputField
                  label={'Password'}
                  name={'password'}
                  containerStyle={styles.field}
                  secureTextEntry={true}
                />
                <InputField
                  label={'Re-enter Password'}
                  name={'confirmPassword'}
                  containerStyle={styles.field}
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.actionContainer}>
                <Button
                  loading={signUpStore.loading}
                  disabled={!isValid}
                  text={'Sign up'}
                  onPress={handleSubmit}
                />
              </View>
            </>
          )}
        </Formik>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(AuthStackNavigatorName.SignIn)}
            activeOpacity={0.7}>
            <Text style={[styles.signUpText, styles.signUpLink]}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.signUpContainer, { marginTop: 10 }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              openTermsURL()
            }}>
            <Text style={[styles.signUpText, styles.signUpLink]}>
              Terms of Use (EULA)
            </Text>
          </TouchableOpacity>
        </View>
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
  pageTitle: {
    paddingHorizontal: 24,
    ...font(24, 36, '600'),
    color: colors.bluePrimary,
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 15,
  },
  signUpContainer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: colors.text.grayText,
    ...font(16, 18),
  },
  signUpLink: {
    color: colors.bluePrimary,
    ...font(14, 16, '500'),
    marginLeft: 4,
  },
  actionContainer: {
    paddingHorizontal: 24,
  },
});
