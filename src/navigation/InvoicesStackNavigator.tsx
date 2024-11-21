import React, { useEffect } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackRouteNames, InvoicesStackRouteNames, MainBottomTabsRouteNames } from './router-names';
import { InvoiceSearchByCategory } from '../screens/InvoiceSearchByCategory';
import { Invoices } from '../screens/Invoices';
import { MainBottomTabsParamList } from './MainBottomTabs';
import { RouteProp } from '@react-navigation/native';


const Stack = createNativeStackNavigator<MainBottomTabsParamList>();
type Props = {
  route: RouteProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Estimate | InvoicesStackRouteNames.InvoicesMain
  >;
  navigation: NativeStackNavigationProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Estimate | InvoicesStackRouteNames.InvoicesMain
  >;
};

export const InvoicesStackNavigator: React.FC<Props> = ({ route, navigation }) => {

  useEffect(() => {
    if (route.params?.defaultTab) {
      navigation.navigate(InvoicesStackRouteNames.InvoicesMain, {
        defaultTab: route.params?.defaultTab
      })
    }
  }, [route.params])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={InvoicesStackRouteNames.InvoicesMain}>
      <Stack.Screen
        component={Invoices}
        name={InvoicesStackRouteNames.InvoicesMain}
      />
      <Stack.Screen
        component={InvoiceSearchByCategory}
        name={HomeStackRouteNames.InvoiceSearchByCategory}
      />
    </Stack.Navigator>
  );
};
