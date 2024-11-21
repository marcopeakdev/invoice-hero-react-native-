import {applyMiddleware} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {PersistConfig, persistReducer, persistStore} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import {userReducer} from './reducers/user';
import {mainReducer} from './reducers/main';
import {invoiceReducer} from './reducers/invoices';
import {clientsReducer} from './reducers/clients';
import {categoriesReducer} from './reducers/categories';
import {dashboardReducer} from './reducers/dashboard';
import {paymentsReducer} from './reducers/payments';
import {businessReducer} from './reducers/business';
import {subscriptionReducer} from './reducers/subscription';

export type AppState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;

const rootPersistConfig: PersistConfig<AppState> = {
  key: 'root',
  timeout: 0,
  version: 1,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    'main',
    'invoices',
    'payments',
    'categories',
    'clients',
    'invoices',
    'business',
  ],
};

const combinedReducer = combineReducers({
  user: persistReducer(
    {
      key: 'user',
      storage: AsyncStorage,
      timeout: 0,
      whitelist: ['token', 'user', 'isAuthorized'],
    },
    userReducer,
  ),
  subscriptions: subscriptionReducer,
  dashboard: dashboardReducer,
  business: businessReducer,
  main: mainReducer,
  invoices: invoiceReducer,
  clients: clientsReducer,
  categories: categoriesReducer,
  payments: paymentsReducer,
});

const rootReducer = persistReducer(rootPersistConfig, combinedReducer);

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
