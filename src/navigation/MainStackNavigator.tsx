import React, { useEffect, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackRouteNames, SettingsStackRouteNames } from './router-names';
import { MainBottomTabs } from './MainBottomTabs';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../store/thunk/user';
import { loadClients } from '../store/thunk/clients';
import { loadCategories } from '../store/thunk/categories';
import { InvoiceStatus } from '../models/invoice';
import { InvoiceList } from '../screens/InvoiceList';
import { InvoiceSingle } from '../screens/InvoiceSingle';
import { InvoiceOverview } from '../dto/invoices';
import { InvoiceSearch } from '../screens/InvoiceSearch';
import { Notifications } from '../screens/Notifications';
import { AddPopup } from '../screens/AddPopup';
import { InvoiceCreate } from '../screens/InvoiceCreate';
import { DropDownList } from '../screens/DropDownList';
import { AddInvoiceDate } from '../screens/AddInvoiceDate';
import { AddInvoiceItems } from '../screens/AddInvoiceItems';
import { AddInvoicePayments } from '../screens/AddInvoicePayments';
import { AddInvoiceDelivery } from '../screens/AddInvoiceDelivery';
import { loadPayments } from '../store/thunk/payments';
import { AddInvoiceCustoms } from '../screens/AddInvoiceCustomts';
import { AddInvoiceNote } from '../screens/AddInvoiceNote';
import { AddInvoiceAttachments } from '../screens/AddInvoiceAttachments';
import { getInvoiceCount } from '../store/thunk/invoices';
import { ClientCreate } from '../screens/ClientCreate';
import { AddAddress } from '../screens/AddAddress';
import { SearchPopup } from '../screens/SearchPopup';
import { SubscriptionModal } from '../screens/SubscriptionModal';
import { AlertSocialAccountModal } from '../screens/AlertSocialAccountModal';
import { loadSubscriptions } from '../store/thunk/subscriptions';
import { useConfigureInAppPurchase } from '../hooks/use-configure-iap';
import { CategoryDropDownList } from '../screens/CategoryDropDownList';
import { AddCategory } from '../screens/AddCategory';
import { ClientDropDownList } from '../screens/ClientDropDownList';
import { RequestPayment } from '../screens/RequestPayment';
import { RequestSignature } from '../screens/RequestSignature';
import { AlertModal } from '../screens/AlertModal';
import { RegisterBusinessProfile } from '../screens/RegisterBusinessProfile';
import { selectIsFirstLogin, selectUser } from '../store/selectors/user';
import { getUserBusiness } from '../store/thunk/business';
import { InvoiceSearchByClient } from '../screens/InvoiceSearchByClient';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';
import { AddInvoiceItemsList } from '../screens/AddInvoiceItemsList';
import { AddInvoiceSingleItem } from '../screens/AddInvoiceSingleItem';
import { ExpenseSingle } from '../screens/ExpenseSingle';
import { ExpenseScan } from '../screens/ExpenseScan';
import { AddExpenseItems } from '../screens/AddExpenseItems';
import { AddExpenseDate } from '../screens/AddExpenseDate';
import { AddExpenseSingleItem } from '../screens/AddExpenseSingleItem';
import { AddExpenseItemsList } from '../screens/AddExpenseItemsList';

const { useRealm } = RealmContext;

export type MainStackParamList = {
  [MainStackRouteNames.RegisterBusinessProfile]: any;
  [MainStackRouteNames.MainBottomTabs]: any;
  [MainStackRouteNames.Notifications]: any;
  [MainStackRouteNames.AddPopup]: undefined;
  [MainStackRouteNames.SearchPopup]: undefined;
  [MainStackRouteNames.SubscriptionModal]: any;
  [MainStackRouteNames.AlertSocialAccountModal]: undefined;
  [MainStackRouteNames.InvoiceCreate]: any;
  [MainStackRouteNames.InvoiceCreate]: any;
  [MainStackRouteNames.ClientCreate]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName?: string;
    clientId?: string;
    callback?: (data: any) => void;
  };
  [MainStackRouteNames.AddAddress]: {
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.AddInvoiceDate]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    recurringPeriod?: any;
    callback?: (date: any) => void;
  };
  [MainStackRouteNames.AddInvoiceItems]: {
    value?: any;
    invoiceId?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    category?: string;
    isEstimate?: boolean;
    callback?: (data: any) => void;
  };
  [MainStackRouteNames.AddInvoiceItemsList]: any;
  [MainStackRouteNames.AddInvoiceSingleItem]: any;
  [MainStackRouteNames.AddInvoicePayments]: {
    value?: string[];
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.AddInvoiceAttachments]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    callback?: (data: any) => void;
  };
  [MainStackRouteNames.AddInvoiceCustoms]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    callback?: (data: any) => void;
  };
  [MainStackRouteNames.AddInvoiceNote]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    callback?: (data: any) => void;
  };
  [MainStackRouteNames.AddInvoiceDelivery]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.RequestPayment]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    invoiceId?: any;
    invoiceNumber?: string;
    payments?: string[];
    unpaidInvoice?: boolean;
    callback?: (requestPayment: any) => void;
  };
  [MainStackRouteNames.RequestSignature]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    invoiceId?: string;
    invoiceNumber?: string;
    callback?: (requestSignature: any) => void;
  };
  [MainStackRouteNames.DropDownList]: {
    title: string;
    list: any[];
    selectedValue?: any;
    returnValueName: string;
    backScreen: MainStackRouteNames;
    callback?: (data: any) => void;
  };
  [MainStackRouteNames.InvoiceList]: {
    showTabs?: boolean;
    activeTab?: InvoiceStatus | null;
    callback?: () => void;
  };
  [MainStackRouteNames.InvoiceSingle]:
    | {
        title: string;
        id: string;
        estimate?: boolean;
        callback?: () => void;
      }
    | any;
  [MainStackRouteNames.ExpenseSingle]:
    | {
        title: string;
        id: string;
        estimate?: boolean;
        callback?: () => void;
      }
    | any;
  [MainStackRouteNames.ExpenseScan]:
    | {
        image: string;
      }
    | any;
  [MainStackRouteNames.ExpensesMain]: any;
  [MainStackRouteNames.InvoiceSearch]: {
    title: string;
    request: InvoiceOverview | any;
  };
  [MainStackRouteNames.InvoiceSearchByClient]: {
    title: string;
    request: InvoiceOverview | any;
  };
  [MainStackRouteNames.CategoryDropDownList]: {
    title: string;
    selectedValue?: any;
    returnValueName: string;
    backScreen: MainStackRouteNames;
    callback?: (category: any) => void;
  };
  [SettingsStackRouteNames.AddCategory]: any;
  [MainStackRouteNames.ClientDropDownList]: {
    title: string;
    selectedValue?: any;
    returnValueName: string;
    backScreen: MainStackRouteNames;
    callback?: (client: any) => void;
  };
  [MainStackRouteNames.AlertModal]: {
    title?: string;
    message?: string;
    callback?: any;
  };
  [MainStackRouteNames.AddExpenseItems]: {
    value?: any;
    expenseId?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    category?: string;
    isEstimate?: boolean;
    callback?: (data: any) => void;
  };
  [MainStackRouteNames.AddExpenseDate]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    recurringPeriod?: any;
    callback?: (date: any) => void;
  };
  [MainStackRouteNames.AddExpenseItemsList]: any;
  [MainStackRouteNames.AddExpenseSingleItem]: any;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigator: React.FC<{}> = () => {
  const dispatch = useDispatch<any>();
  useConfigureInAppPurchase();
  const isFirstLogin = useSelector(selectIsFirstLogin);

  const initialRouteName = useMemo(() => {
    console.log({ isFirstLogin });
    return isFirstLogin
      ? MainStackRouteNames.RegisterBusinessProfile
      : MainStackRouteNames.MainBottomTabs;
  }, [isFirstLogin]);

  const user = useSelector(selectUser);
  const realm = useRealm();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getUserBusiness());
    dispatch(loadClients());
    dispatch(loadCategories());
    dispatch(loadPayments());
    dispatch(getInvoiceCount());
    dispatch(loadSubscriptions());
  }, []);

  useEffect(() => {
    // initialize the subscriptions
    if (user) {
      console.log({ user });
      const updateSubscriptions = async () => {
        await realm.subscriptions.update((mutableSubs) => {
          let queryString = 'user == $0 && isDeleted != true';
          const invoices = realm
            .objects('invoices')
            .filtered(queryString, new BSON.ObjectID(user?._id));
          mutableSubs.add(invoices, { name: 'ownInvoices' });

          const expenses = realm
            .objects('expenses')
            .filtered('user == $0', new BSON.ObjectID(user?._id));
          mutableSubs.add(expenses, { name: 'ownExpenses' });

          const clients = realm
            .objects('clients')
            .filtered('user == $0', new BSON.ObjectID(user?._id));
          mutableSubs.add(clients, { name: 'ownClients' });
        });
      };
      updateSubscriptions();
    }
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen
        name={MainStackRouteNames.RegisterBusinessProfile}
        component={RegisterBusinessProfile}
      />
      <Stack.Screen name={MainStackRouteNames.MainBottomTabs} component={MainBottomTabs} />
      <Stack.Screen component={ClientCreate} name={MainStackRouteNames.ClientCreate} />
      <Stack.Screen component={AddAddress} name={MainStackRouteNames.AddAddress} />
      <Stack.Screen component={InvoiceList} name={MainStackRouteNames.InvoiceList} />
      <Stack.Screen component={InvoiceSingle} name={MainStackRouteNames.InvoiceSingle} />
      <Stack.Screen component={ExpenseSingle} name={MainStackRouteNames.ExpenseSingle} />
      <Stack.Screen component={ExpenseScan} name={MainStackRouteNames.ExpenseScan} />
      <Stack.Screen component={AddExpenseItems} name={MainStackRouteNames.AddExpenseItems} />
      <Stack.Screen component={AddExpenseDate} name={MainStackRouteNames.AddExpenseDate} />
      <Stack.Screen component={AddExpenseSingleItem} name={MainStackRouteNames.AddExpenseSingleItem} />
      <Stack.Screen component={AddExpenseItemsList} name={MainStackRouteNames.AddExpenseItemsList} />
      <Stack.Screen component={InvoiceCreate} name={MainStackRouteNames.InvoiceCreate} />
      <Stack.Screen component={InvoiceSearch} name={MainStackRouteNames.InvoiceSearch} />
      <Stack.Screen
        component={InvoiceSearchByClient}
        name={MainStackRouteNames.InvoiceSearchByClient}
      />
      <Stack.Screen component={Notifications} name={MainStackRouteNames.Notifications} />
      <Stack.Screen
        component={SubscriptionModal}
        name={MainStackRouteNames.SubscriptionModal}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        component={AlertSocialAccountModal}
        name={MainStackRouteNames.AlertSocialAccountModal}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        component={AlertModal}
        name={MainStackRouteNames.AlertModal}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen component={DropDownList} name={MainStackRouteNames.DropDownList} />
      <Stack.Screen
        component={CategoryDropDownList}
        name={MainStackRouteNames.CategoryDropDownList}
      />
      <Stack.Screen component={ClientDropDownList} name={MainStackRouteNames.ClientDropDownList} />
      <Stack.Screen component={AddCategory} name={SettingsStackRouteNames.AddCategory} />
      <Stack.Screen component={AddInvoiceDate} name={MainStackRouteNames.AddInvoiceDate} />
      <Stack.Screen component={AddInvoiceItems} name={MainStackRouteNames.AddInvoiceItems} />
      <Stack.Screen component={AddInvoiceItemsList} name={MainStackRouteNames.AddInvoiceItemsList} />
      <Stack.Screen component={AddInvoiceSingleItem} name={MainStackRouteNames.AddInvoiceSingleItem} />
      <Stack.Screen component={AddInvoicePayments} name={MainStackRouteNames.AddInvoicePayments} />
      <Stack.Screen component={AddInvoiceDelivery} name={MainStackRouteNames.AddInvoiceDelivery} />
      <Stack.Screen component={RequestPayment} name={MainStackRouteNames.RequestPayment} />
      <Stack.Screen component={RequestSignature} name={MainStackRouteNames.RequestSignature} />
      <Stack.Screen component={AddInvoiceCustoms} name={MainStackRouteNames.AddInvoiceCustoms} />
      <Stack.Screen component={AddInvoiceNote} name={MainStackRouteNames.AddInvoiceNote} />
      <Stack.Screen
        component={AddInvoiceAttachments}
        name={MainStackRouteNames.AddInvoiceAttachments}
      />
      <Stack.Screen
        name={MainStackRouteNames.AddPopup}
        component={AddPopup}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        name={MainStackRouteNames.SearchPopup}
        component={SearchPopup}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
};
