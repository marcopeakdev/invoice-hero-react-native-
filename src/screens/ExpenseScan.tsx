import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { RouteProp } from '@react-navigation/native';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BtnType, Button } from '../components/Button';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import FastImage from 'react-native-fast-image';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors } from '../styles/colors';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.ExpenseScan>;
  navigation: NativeStackNavigationProp<MainStackParamList, MainStackRouteNames.ExpenseScan>;
};

export const ExpenseScan: React.FC<Props> = ({ route, navigation }) => {
  console.log(route.params);
  const handleNext = () => {
    navigation.navigate(MainStackRouteNames.ExpenseSingle, {
      image: route.params?.image,
    });
  }

  const handleCancel = () => {
    navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <Header
        title={'Scaning'}
        showBackBtn={true}
        onBackPress={() => {
          navigation.goBack();
        }}
      >
      </Header>
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: -16,
          padding: 12,
          flex: 1,
        }}
      >
        <PageContainer>
          <View style={styles.mainContainer}>
            <Text style={{ fontSize: 16, color: colors.bluePrimary }}>Scaning the image</Text>
            <Text style={{ marginVertical: 5, color: colors.gray, fontSize: 12 }}>Please wait</Text>
            <View style={styles.imageContainer}>
              <FastImage source={{ uri: route.params?.image }} style={styles.image} />
              <View style={styles.progressContainer}>
                <CircularProgress
                  value={100}
                  maxValue={100}
                  duration={3000}
                  radius={35}
                  valueSuffix={'%'}
                  onAnimationComplete={handleNext}
                  progressValueColor={'#000'}
                  activeStrokeColor={'#5799F8'}
                  inActiveStrokeColor={'rgba(87, 153, 248, 0.5)'}
                />
              </View>
            </View>
          </View>
        </PageContainer>
        <View style={{ padding: 10 }}>
          <Button
            text={'Cancel'}
            onPress={handleCancel}
            type={BtnType.Primary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 15,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
