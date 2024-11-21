import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackRouteNames, SettingsStackRouteNames } from './router-names';
import { Settings } from '../screens/Settings';
import { Account } from '../screens/Account';
import { Terms } from '../screens/Terms';
import { Privacy } from '../screens/Privacy';
import { ContactUs } from '../screens/ContactUs';
import { ChangePassword } from '../screens/ChangePassowrd';
import { BusinessInfo } from '../screens/BusinessInfo';
import { AddTax } from '../screens/AddTax';
import { ManageCategory } from '../screens/ManageCategory';
import { AddCategory } from "../screens/AddCategory";
import { MainStackNavigator } from './MainStackNavigator';

export type SettingRouterParamList = {
  [SettingsStackRouteNames.SettingsMain]: undefined;
  [SettingsStackRouteNames.Account]: undefined;
  [SettingsStackRouteNames.Terms]: any;
  [SettingsStackRouteNames.Privacy]: any;
  [SettingsStackRouteNames.ContactUs]: undefined;
  [SettingsStackRouteNames.ChangePassword]: undefined;
  [SettingsStackRouteNames.BusinessInfo]: any;
  [SettingsStackRouteNames.AddTax]: any;
  [SettingsStackRouteNames.ManageCategory]: any;
  [SettingsStackRouteNames.AddCategory]: any;
  [MainStackRouteNames.SubscriptionModal]: any;
};

const Stack = createNativeStackNavigator<SettingRouterParamList>();

export const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SettingsStackRouteNames.SettingsMain}>
      <Stack.Screen
        component={Settings}
        name={SettingsStackRouteNames.SettingsMain}
      />
      <Stack.Screen
        component={Account}
        name={SettingsStackRouteNames.Account}
      />
      <Stack.Screen component={Terms} name={SettingsStackRouteNames.Terms} />
      <Stack.Screen component={AddTax} name={SettingsStackRouteNames.AddTax} />
      <Stack.Screen
        component={ManageCategory}
        name={SettingsStackRouteNames.ManageCategory}
      />
      <Stack.Screen
        component={AddCategory}
        name={SettingsStackRouteNames.AddCategory}
      />
      <Stack.Screen
        component={BusinessInfo}
        name={SettingsStackRouteNames.BusinessInfo}
      />
      <Stack.Screen
        component={Privacy}
        name={SettingsStackRouteNames.Privacy}
      />
      <Stack.Screen
        component={ChangePassword}
        name={SettingsStackRouteNames.ChangePassword}
      />
      <Stack.Screen
        component={ContactUs}
        name={SettingsStackRouteNames.ContactUs}
      />
    </Stack.Navigator>
  );
};
