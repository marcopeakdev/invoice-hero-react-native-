import React, { useEffect } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExpensesStackRouteNames, MainBottomTabsRouteNames } from './router-names';
import { MainBottomTabsParamList } from './MainBottomTabs';
import { RouteProp } from '@react-navigation/native';
import { Expenses } from '../screens/Expenses';


const Stack = createNativeStackNavigator<MainBottomTabsParamList>();
type Props = {
  route: RouteProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Expenses | ExpensesStackRouteNames.ExpensesMain
  >;
  navigation: NativeStackNavigationProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Expenses | ExpensesStackRouteNames.ExpensesMain
  >;
};

export const ExpensesStackNavigator: React.FC<Props> = ({ route, navigation }) => {

  useEffect(() => {
    if (route.params?.defaultTab) {
      navigation.navigate(ExpensesStackRouteNames.ExpensesMain, {
        defaultTab: route.params?.defaultTab
      })
    }
  }, [route.params])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ExpensesStackRouteNames.ExpensesMain}>
      <Stack.Screen
        component={Expenses}
        name={ExpensesStackRouteNames.ExpensesMain}
      />
    </Stack.Navigator>
  );
};
