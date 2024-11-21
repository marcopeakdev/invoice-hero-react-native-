import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackRouteNames, InvoicesStackRouteNames } from './router-names';
import { Home } from '../screens/Home';
import { InvoiceSearchByCategory } from '../screens/InvoiceSearchByCategory';
import { InvoiceOverview } from '../dto/invoices';

export type HomeRouterParamList = {
  [HomeStackRouteNames.HomeMain]: undefined;
  [HomeStackRouteNames.InvoiceSearchByCategory]: {
    title: string;
    request: InvoiceOverview;
  };
};

const Stack = createNativeStackNavigator<HomeRouterParamList>();

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={HomeStackRouteNames.HomeMain}>
      <Stack.Screen
        component={Home}
        name={HomeStackRouteNames.HomeMain}
      />
      <Stack.Screen
        component={InvoiceSearchByCategory}
        name={HomeStackRouteNames.InvoiceSearchByCategory}
      />
    </Stack.Navigator>
  );
};
