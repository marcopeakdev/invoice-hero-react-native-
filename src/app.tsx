import React, { useEffect } from 'react';
import 'react-native-get-random-values'
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { RootRouter } from './navigation/RootRouter';
import { persistor, store } from './store/store';
import { LoadAppProvider } from './providers/LoadAppProvider';
import { ActivityIndicator, StatusBar, LogBox, View } from 'react-native';

import * as Sentry from "@sentry/react-native";
import {withIAPContext} from 'react-native-iap';
import { AppProvider, useApp, UserProvider, useUser } from '@realm/react';
import appsFlyer from 'react-native-appsflyer';
import { appId, baseUrl, realmApiKey } from '../realm.json';
import RealmContext from './database/RealmContext';
import { colors } from './styles/colors';
const { RealmProvider } = RealmContext;

appsFlyer.initSdk(
  {
    devKey: '3SpnZUdJ33q9rzd5Aqrk9H',
    isDebug: false,
    appId: 'com.invoiceheromaker.app',
    onInstallConversionDataListener: true, //Optional
    onDeepLinkListener: true, //Optional
    timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
  },
  (result) => {
    console.log('Test:', result);
  },
  (error) => {
    console.error(error);
  }
);

Sentry.init({
  dsn: "https://c6f7ce22eef644e79d54d8ef1d0745bd@o4503962731610112.ingest.sentry.io/4504373897986048",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const AppWrapper = () => {
  return (
    <AppProvider id={appId} baseUrl={baseUrl}>
      <App />
    </AppProvider>
  );
};

const App = () => {

  const app = useApp();

  const getUser = async () => {
    if (app.currentUser) return app.currentUser;
    const credentials = Realm.Credentials.apiKey(realmApiKey);
    return await app.logIn(credentials);
  };

  useEffect(() => {
    getUser()
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <LoadAppProvider>
            <UserProvider>
              <RealmProvider
                sync={{
                  flexible: true,
                  initialSubscriptions: {
                    update: (subs, realm) => {
                      // subscribe to all of the logged in user's to-do items
                      subs.add(realm.objects('payments'), { name: 'ownPayments' });
                      subs.add(realm.objects('categories'), { name: 'ownCategories' });
                      subs.add(realm.objects('addresses'), { name: 'ownAddresses' });
                      subs.add(realm.objects('invoices'), { name: 'ownInvoices' });
                      subs.add(realm.objects('expenses'), { name: 'ownExpenses' });
                      subs.add(realm.objects('clients'), { name: 'ownClients' });
                      subs.add(realm.objects('businesses'), { name: 'ownBusiness' });
                    },
                  }
                }}
                fallback={<View
                  style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }
                  }>
                  <ActivityIndicator size={'large'} color={colors.bluePrimary} />
                </View>
                }
              >
                <NavigationContainer>
                  <StatusBar barStyle={'light-content'} />
                  <RootRouter />
                </NavigationContainer>
              </RealmProvider>
            </UserProvider>
          </LoadAppProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(withIAPContext(AppWrapper));
