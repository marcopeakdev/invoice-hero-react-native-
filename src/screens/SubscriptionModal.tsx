import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  BackHandler,
  TouchableOpacity,
  Linking,
} from 'react-native';
import SafariView from 'react-native-safari-view';
import { useDebouncedCallback } from 'use-debounce';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { getSubscriptions, requestSubscription, useIAP } from 'react-native-iap';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames, SettingsStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Overlay } from '../components/Overlay';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, gradients } from '../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { font } from '../styles/font';
import { Button } from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../assets/images';
import { useSelector } from 'react-redux';
import { selectSubscriptions } from '../store/selectors/subscriptions';
import { CloseIcon } from '../components/icons/CloseIcon';
import { isIOS } from '../utils/constants';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.SubscriptionModal>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.SubscriptionModal
  >;
};

export const SubscriptionModal: React.FC<Props> = ({ route }) => {
  const { currentPurchase } = useIAP();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const subscriptions = useSelector(selectSubscriptions);

  const animatedProgress = useSharedValue(-1);

  useEffect(() => {
    animatedProgress.value = withSpring(0);
    const backAction = () => {
      goBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();

  }, []);

  useEffect(() => {
    subscriptions.result.map((subscription: any, index: number) => {
      if (subscription.androidId === currentPurchase?.productId) {
        setSelectedPlan(index);
      }
    });
  }, [subscriptions, currentPurchase]);

  const currentPurchaseIndex = useMemo(() => {
    return subscriptions.result.findIndex((subscription: any) => subscription.androidId === currentPurchase?.productId);
  }, [subscriptions, currentPurchase])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedProgress.value,
      [-1, 0],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const onClose = () => {
    animatedProgress.value = withTiming(
      -1,
      {
        duration: 300,
      },
      canceled => {
        runOnJS(goBack)();
      },
    );
  };

  const goBack = () => {
    if (route.params?.callback) {
      route.params.callback()
    }
    navigation.goBack();
  };

  const selectSubscription = useDebouncedCallback(async v => {
    try {
      if (selectedPlan === null) {
        return;
      }

      const subscription = subscriptions.result[selectedPlan];

      const result = await getSubscriptions({ skus: [subscription.androidId] }); // this is required otherwise sku not found error would be thourn when requestSub
      console.log(result);
      if (isIOS) {
        await requestSubscription({
          sku: subscription.androidId,
        });
      } else {
        await requestSubscription({
          sku: subscription.androidId,
          subscriptionOffers: [
            {
              sku: subscription.androidId,
              offerToken: result[0].subscriptionOfferDetails[0].offerToken,
            },
          ],
        });
      }
      onClose();
    } catch (e) {
      console.log(e);
      onClose();
    }
  }, 400);
  
  const openTermsURL = (url: string) => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Terms Screen on Android
    else {
      navigation.navigate(SettingsStackRouteNames.Terms);
    }
  };
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <Overlay animatedProgress={animatedProgress} />
      </Pressable>
      <View
        style={[styles.modal, { top: insets.top + 24, bottom: insets.bottom }]}>
        <View style={styles.topBlock}>
          <Text style={styles.title}>
            Upgrade for {'\n'}
            <Text style={styles.titleBold}>
              unlimited access {'\n'} and free cloud storage {'\n'}
            </Text>{' '}
            on all plans.
          </Text>
        </View>
        <View style={styles.plansBlock}>
          {subscriptions.result.map((subscription, index) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => setSelectedPlan(index)}
                key={`feature_${index}`}>
                <LinearGradient
                  {...gradients.planGradient}
                  style={[
                    styles.plan,
                    selectedPlan === index && styles.planActive,
                  ]}>
                  <View style={styles.planContent}>
                    <View style={styles.leftBlock}>
                      {subscription.androidId === currentPurchase?.productId && (
                        <View>
                          <Text>Currently Subscribed</Text>
                        </View>
                      )}
                      <Text style={styles.planTitle}>{subscription.name}</Text>
                      <Text style={styles.planPrice}>
                        <Text style={styles.planDollar}>$ </Text>
                        {Number(subscription.cost) / 100}
                      </Text>
                      <Text style={styles.planDescription}>
                        {subscription.description}
                      </Text>
                    </View>
                    <View style={styles.rightBlock}>
                      <Image
                        resizeMode='contain'
                        style={styles.planImage}
                        source={Images[subscription.image]}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
        <View style={styles.actionBlock}>
          <Button
            disabled={(selectedPlan === null || subscriptions.result[selectedPlan].androidId === currentPurchase?.productId)}
            text={(selectedPlan === null || currentPurchaseIndex === selectedPlan) ? 'Subscribe' : (currentPurchaseIndex < selectedPlan ? 'Upgrade' : 'Downgrade')}
            onPress={selectSubscription}
          />
        </View>
        <View style={{ flex: 1}}>
          <View style={[styles.actionBlock, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                openTermsURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')
              }>
              <Text style={[styles.signUpText, styles.signUpLink]}>
                Terms of Use (EULA)
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.actionBlock, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(SettingsStackRouteNames.Privacy, {isSubscription: true})
              }>
              <Text style={[styles.signUpText, styles.signUpLink]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={onClose}
          style={{
            position: 'absolute',
            top: insets.top + 12,
            right: insets.right + 12,
            width: 36,
            height: 36,
            backgroundColor: 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18
          }}>
          <CloseIcon
            color={colors.bluePrimary}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0,
  },
  modal: {
    position: 'absolute',
    backgroundColor: colors.screenBackground,
    left: 24,
    right: 24,
    borderRadius: 15,
    paddingHorizontal: 25,
  },
  topBlock: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plansBlock: {},
  actionBlock: {
    marginBottom: 10,
  },
  title: {
    ...font(20, 24, '400'),
    color: '#4c4c4c',
    textAlign: 'center',
  },
  titleBold: {
    ...font(20, 24, '500'),
    color: '#000',
  },
  plan: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 15,
    height: 120,
    marginBottom: 15,
  },
  planContent: {
    flexDirection: 'row',
  },
  planActive: {
    borderWidth: 1,
    borderColor: colors.bluePrimary,
  },
  leftBlock: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  rightBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitle: {
    ...font(15, 16, '500'),
  },
  planDollar: {
    ...font(13, 30, '500'),
  },
  planPrice: {
    color: colors.text.darkGrayText,
    ...font(27, 30, '600'),
  },
  planDescription: {
    ...font(12, 13, '500'),
    color: colors.bluePrimary,
  },
  planImage: {
    height: '90%',
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
});
