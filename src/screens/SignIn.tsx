import React, { useEffect } from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import { AuthLayout } from '../components/AuthLayout';
import { BtnType, Button } from '../components/Button';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { AuthStackNavigatorName, SettingsStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import appsFlyer from 'react-native-appsflyer';
import { AuthRouterParamList } from '../navigation/AuthStackNavigator';
import * as Yup from 'yup';
import { InputField } from '../components/form/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../store/thunk/user';
import { AppDispatch } from '../store/store';
import { AnyAction } from 'redux';
import { selectSignIn } from '../store/selectors/user';
// import {LoginButton, AccessToken} from 'react-native-fbsdk';
import SafariView from 'react-native-safari-view';
import { socialLogin } from '../store/reducers/user';
import { api, baseURL } from '../utils/api';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { FacebookIcon } from '../components/icons/FacebookIcon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppleIcon } from '../components/icons/AppleIcon';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { showMessage } from 'react-native-flash-message';

const initialValues = {
  email: '',
  password: '',
};

type Props = {
  navigation: NativeStackNavigationProp<AuthRouterParamList>;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('Required Field'),
  password: Yup.string().required('Required Field'),
});

export const SignIn: React.FC<Props> = ({ navigation }) => {
  const signInStore = useSelector(selectSignIn);

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (values: any): any => {
    appsFlyer.logEvent(
      'af_signin',
      {
        ...values,
        email: values.email?.toLowerCase(),
      },
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    
    dispatch(
      signIn({
        ...values,
        email: values.email?.toLowerCase(),
      }) as unknown as AnyAction,
    );
  };

  useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleOpenURL({ url });
      }
    });
  })

  const loginWithGoogle = () => openURL(`${baseURL}/auth/google`);
  const loginWithFacebook = () => openURL(`${baseURL}/auth/facebook`);
  const loginWithApple = async (): Promise<any> => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      dispatch(
        signIn({
          sourceType: "apple",
          sourceId: appleAuthRequestResponse?.user,
          email: appleAuthRequestResponse?.email,
          name: appleAuthRequestResponse?.fullName,
        }) as unknown as AnyAction,
      );
    } else {
      showMessage({
        message: "Login unsuccessful by apple",
        type: 'danger',
      });
    }
  }

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

  const handleOpenURL = ({ url }: { url: String }) => {
    const [, user_string] = url.match(/user=([^#]+)/) || [];
    if (url && user_string) {
      const user = JSON.parse(decodeURI(user_string))
  
      if (user.token) {
        api.defaults.headers.common.Authorization = `Bearer ${user.token}`;
      }
      dispatch(socialLogin(user))
      if (Platform.OS === 'ios') {
        SafariView.dismiss();
      }
    }
  };


  return (
    <AuthLayout>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
      >
        <Text style={styles.pageTitle}>Sign In</Text>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          validateOnMount={true}
          onSubmit={onSubmit}>
          {({ handleSubmit, isValid }) => (
            <>
              <View style={styles.formContainer}>
                <InputField
                  label={'Email'}
                  name={'email'}
                  keyboardType='email-address'
                  textInputProps={{
                    autoCapitalize: 'none'
                  }}
                />
                <InputField
                  label={'Password'}
                  name={'password'}
                  secureTextEntry={true}
                />
                <View style={styles.forgotPasswordBlock}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      navigation.navigate(AuthStackNavigatorName.ForgotPassword)
                    }>
                    <Text style={styles.forgotPasswordText}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.actionContainer}>
                <Button
                  text={'Sign in'}
                  disabled={!isValid}
                  onPress={handleSubmit}
                  loading={signInStore.loading}
                />
              </View>
              <View style={[styles.actionContainer, { marginTop: 12 }]}>
                <Button
                  type={BtnType.Outlined}
                  icon={<GoogleIcon
                    size={22}
                  />}
                  text={'Sign in with Google'}
                  onPress={loginWithGoogle}
                />
              </View>
              <View style={[styles.actionContainer, { marginTop: 12 }]}>
                <Button
                  icon={<FacebookIcon
                    size={22}
                  />}
                  text={'Sign in with Facebook'}
                  onPress={loginWithFacebook}
                />
              </View>
              {Platform.OS === 'ios' &&
                <View style={[styles.actionContainer, { marginTop: 12 }]}>
                  <Button
                    type={BtnType.Outlined}
                    icon={<AppleIcon
                      size={22}
                    />}
                    text={'Sign in with Apple'}
                    onPress={loginWithApple}
                  />
                </View>
              }
            </>
          )}
        </Formik>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(AuthStackNavigatorName.SignUp)}>
            <Text style={[styles.signUpText, styles.signUpLink]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.signUpContainer, { marginTop: 10 }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              openTermsURL()
            }>
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
  pageTitle: {
    ...font(23, 36, '600'),
    color: colors.bluePrimary,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  formContainer: {
    marginBottom: 15,
  },
  signUpContainer: {
    paddingHorizontal: 24,
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
    ...font(14, 16, '500'),
    color: colors.bluePrimary,
    marginLeft: 4,
  },
  forgotPasswordBlock: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    ...font(16, 24),
    color: colors.text.grayText,
  },
  actionContainer: {
    paddingHorizontal: 24,
  },
  fbBtn: {
    // width: '100%',
    // height: 50,
    marginTop: 12,
    marginHorizontal: 24,
    padding: 20,
  }
});
