import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Platform } from 'react-native';
import { Formik } from 'formik';
import { colors, gradients } from '../styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthRouterParamList } from '../navigation/AuthStackNavigator';
import { font } from '../styles/font';
import { InputField } from '../components/form/InputField';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/selectors/user';
import { selectBusiness } from '../store/selectors/business';

import { signUp } from '../store/thunk/user';
import { resetFirstLogin, resetSignUp } from '../store/reducers/user';
import { constants } from '../utils/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackArrowIcon } from '../components/icons/BackArrow';
import { Images } from '../assets/images';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { CheckMarkIcon } from '../components/icons/CheckMarkIcon';
import { BtnType, Button } from '../components/Button';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { createUserBusiness } from '../store/thunk/business';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('Required Field'),
  password: Yup.string().required('Required Field'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
  address: {
    street: '',
    apt: '',
    city: ''
  }
};

export const RegisterBusinessProfile: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const form = useRef<any>()

  const carousel = useRef<any>();
  const [activeSlide, setActiveSlide] = useState(0)

  const dispatch = useDispatch<any>();
  const user = useSelector(selectUser);
  const business = useSelector(selectBusiness)

  const onSubmit = async (values: any) => {
    await dispatch(createUserBusiness({ ...values }))
  };

  const onLeftButtonPress = () => {
    if (activeSlide === 1) {
      carousel.current && carousel.current.snapToPrev()
    } else {
      dispatch(resetFirstLogin())
      navigation.reset({
        index: 0,
        routes: [{
          name: MainStackRouteNames.MainBottomTabs
        }]
      })
    }
  }

  const onRightButtonPress = async () => {
    if (activeSlide === 0) {
      const data = { ...form.current.values, user: user?._id, }
      await dispatch(createUserBusiness(data))
      carousel.current && carousel.current.snapToNext()
    } else {
      dispatch(resetFirstLogin())
      navigation.navigate(MainStackRouteNames.MainBottomTabs)
      navigation.reset({
        index: 0,
        routes: [{
          name: MainStackRouteNames.MainBottomTabs
        }]
      })
    }
  }

  const businessForm = () => {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={Images.authImage}
            style={[styles.authImage]}
            resizeMode="center"
          />
          <Text style={styles.topBlockTitle}>Business Info</Text>
          <Text style={styles.messageText}>{`(All fields are optional)`}</Text>
          <Text style={styles.messageText}>Don't Worry! You can change this later in the settings</Text>
          <Formik
            innerRef={form}
            initialValues={initialValues}
            validateOnMount={true}
            onSubmit={onSubmit}>
            {({ handleSubmit, isValid }) => (

              <View style={styles.formContainer}>
                <InputField
                  name={'name'}
                  containerStyle={styles.field}
                  placeholder={'Business Name'}
                />
                <InputField
                  placeholder={'Enter email...'}
                  name={'email'}
                  containerStyle={{ ...styles.field, marginBottom: 4 }}
                  keyboardType="email-address"
                />
                <InputField
                  placeholder={'Phone'}
                  name={'phoneNumber'}
                  containerStyle={{ ...styles.field, marginTop: 0 }}
                  keyboardType="phone-pad"
                />
                <InputField
                  placeholder={'Address Line 1'}
                  name={'address.street'}
                  containerStyle={{ ...styles.field, marginBottom: 4 }}
                />
                <InputField
                  placeholder={'Address Line 2'}
                  name={'address.apt'}
                  containerStyle={{ ...styles.field, marginBottom: 4, marginTop: 0 }}
                />
                <InputField
                  placeholder={'Address Line 3'}
                  name={'address.city'}
                  containerStyle={{ ...styles.field, marginTop: 0 }}
                />
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    )
  }

  const completedView = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <CheckMarkIcon size={60} />
        <Text style={styles.allSetText}>All Set!</Text>
        <Text style={styles.messageText}>You're ready to create your first Invoice</Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 16,
            borderRadius: 4,
            marginTop: 16
          }}
          onPress={() => {
            dispatch(resetFirstLogin())
            navigation.reset({
              index: 0,
              routes: [{
                name: MainStackRouteNames.MainBottomTabs
              }, {
                name: MainStackRouteNames.InvoiceCreate
              }]
            })
          }}
        >
          <Text style={styles.createButtonText}>CREATE INVOICE</Text>
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    if (user && form.current && form.current.values) {
      form.current.values.email = user.email;
    }
  }, [user, form])

  const pagination = () => {
    return (
      <Pagination
        dotsLength={2}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={{
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  const leftItem = () => {
    return activeSlide === 1 ? (
      <TouchableOpacity style={styles.icon} onPress={onLeftButtonPress}>
        <BackArrowIcon />
      </TouchableOpacity>
    ) : <View />
  }

  const rightItem = () => {
    return business.loading ? (<ActivityIndicator
      size={'small'}
      color={colors.whiteColor}
    />) : (
      <TouchableOpacity style={styles.icon} onPress={onRightButtonPress}>
        <Text style={styles.nextButton}>{activeSlide === 0 ? 'Next' : 'Finish'}</Text>
      </TouchableOpacity>
    )
  }


  const _renderItem = ({ item, index }: any) => {
    return index === 0 ? businessForm() : completedView()
  }

  return (
    <View style={[styles.container]}>
      <LinearGradient
        {...gradients.mainBlueGradient}
        style={[styles.topBlock, { paddingTop: 24 }]}>
        <View style={styles.headerContainer}>
          {leftItem()}
          {pagination()}
          {rightItem()}
        </View>
        <Carousel
          style={{ display: 'flex', flex: 1 }}
          scrollEnabled={false}
          ref={carousel}
          data={['test', 'test']}
          renderItem={_renderItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
          onSnapToItem={(index) => {
            setActiveSlide(index)
          }}
        />
      </LinearGradient>
    </View >
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topBlock: {
    flex: 1,
    paddingBottom: constants.pageContainerBorderHeight,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    height: 76,
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'space-between'
  },
  icon: {
    marginRight: 8,
  },
  authImage: {
    width: 181,
  },
  topBlockTitle: {
    ...font(26, 28, '600'),
    color: colors.text.whiteText,
    textTransform: 'uppercase',
    marginTop: 27,
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
  field: {
    marginBottom: 16,
    marginTop: 16,
  },
  nextButton: {
    ...font(18, 20, '500'),
    color: colors.whiteColor
  },
  createButtonText: {
    ...font(16, 18),
    color: colors.text.blue,
  },
  allSetText: {
    ...font(20, 22),
    color: colors.whiteColor,
    margin: 12
  },
  messageText: {
    ...font(12, 14),
    color: colors.whiteColor,
    margin: 4
  }
})