import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootRouteNames} from './router-names';
import {MainStackNavigator} from './MainStackNavigator';
import {useSelector} from 'react-redux';
import {selectIsAuthorized} from '../store/selectors/user';
import {AuthStackNavigator} from './AuthStackNavigator';
import FlashMessage from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type RouterParamList = {
  [RootRouteNames.MainStackNavigator]: undefined;
  [RootRouteNames.AuthStackNavigator]: undefined;
};

const Stack = createNativeStackNavigator<RouterParamList>();

export const RootRouter: React.FC = () => {
  const insets = useSafeAreaInsets();
  const isAuthorized = useSelector(selectIsAuthorized);

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
        }}>
        {isAuthorized ? (
          <Stack.Screen
            name={RootRouteNames.MainStackNavigator}
            component={MainStackNavigator}
          />
        ) : (
          <Stack.Screen
            name={RootRouteNames.AuthStackNavigator}
            component={AuthStackNavigator}
          />
        )}
      </Stack.Navigator>
      <FlashMessage
        position="top"
        duration={4000}
        statusBarHeight={insets.top}
      />
    </>
  );
};
