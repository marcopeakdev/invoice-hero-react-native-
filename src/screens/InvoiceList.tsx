import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { RouteProp } from '@react-navigation/native';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvoiceStatus } from '../models/invoice';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { Card } from '../components/Card';
import { InvoiceSmallCard } from '../components/InvoiceSmallCard';
import { colors } from '../styles/colors';
import { useDispatch, useSelector } from 'react-redux';
import { loadInvoiceBalanceOverview, loadListInvoice } from '../store/thunk/invoices';
import { clearListInvoice } from '../store/reducers/invoices';
import { currencyFormatter } from '../utils/currency';
import { EmptyResult } from '../components/EmptyResult';
import { font } from '../styles/font';
import RealmContext from '../database/RealmContext';
import { selectUser } from '../store/selectors/user';
import { BSON } from 'realm';

const { useQuery } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceList>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.InvoiceList
  >;
};

const tabs = [
  {
    label: 'All',
    value: null,
  },
  {
    label: 'Paid',
    value: InvoiceStatus.Paid,
  },
  {
    label: 'Unpaid',
    value: InvoiceStatus.Unpaid,
  },
  {
    label: 'Estimate',
    value: InvoiceStatus.Estimate,
  },
  {
    label: 'Partially Paid',
    value: InvoiceStatus.PartiallyPaid,
  },
];

export const InvoiceList: React.FC<Props> = ({ route }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState(route?.params?.activeTab || null);
  const [page, setPage] = useState(1);

  const reloadPreviousScreen = route?.params?.callback

  const callback = useCallback(() => {
    const statuses = activeTab
      ? [activeTab]
      : [InvoiceStatus.Paid, InvoiceStatus.Unpaid]
    setPage(1)
    dispatch(clearListInvoice())
    dispatch(loadInvoiceBalanceOverview({ statuses }))
    dispatch(
      loadListInvoice({
        statuses,
        page,
      }),
    );
  }, [])

  useEffect(() => {
    return () => {
      dispatch(clearListInvoice())
      typeof reloadPreviousScreen === "function" && reloadPreviousScreen()
    };
  }, []);

  const statuses = useMemo(() => {
    return activeTab ? [activeTab] : [InvoiceStatus.Paid, InvoiceStatus.Unpaid]
  }, [activeTab])

  const user = useSelector(selectUser)
  const invoiceItems = useQuery('invoices');

  const queryString = useMemo(() => {
    let _queryString = `user == $0 && isDeleted != true`// && status IN {"${InvoiceStatus.Paid}"} && category._id IN {${route.params.request.categories?.map(item => `oid(${new BSON.ObjectID(item)})`).join(",")}}`

    if (searchTerm) {
      _queryString += ` && ( number CONTAINS[c] "${searchTerm}"`
      _queryString += ` or billTo.name CONTAINS[c] "${searchTerm}")`
    }

    _queryString += ` && status IN {${statuses.map(status => `"${status}"`).join(',')}}`

    return _queryString
  }, [searchTerm, statuses])

  const invoicesResult = useMemo(() => {
    return invoiceItems.filtered(queryString, new BSON.ObjectID(user?._id));
  }, [invoiceItems, queryString])

  const total = useMemo(() => {
    let _queryString = `user == $0 && isDeleted != true`;
    _queryString += ` && status IN {${statuses.map(status => `"${status}"`).join(',')}}`
    return invoiceItems.filtered(_queryString, new BSON.ObjectID(user?._id)).sum(activeTab === InvoiceStatus.PartiallyPaid ? 'deposit' : 'total')
  }, [invoiceItems, statuses,])

  const tabLabel = useMemo(() => {
    return tabs.find(t => t.value === activeTab);
  }, [activeTab]);

  const renderItem = useCallback(({ item }: any) => {
    return <InvoiceSmallCard item={item} callback={callback} />;
  }, []);

  const listHeaderComponent = useMemo(() => {
    return (
      <Card containerStyle={styles.shadowCard}>
        <Text style={styles.labelText}>Total</Text>
        <Text style={styles.totalText}>{currencyFormatter.format(total)}</Text>
      </Card>
    );
  }, [total]);

  return (
    <View style={styles.container}>
      <Header title={`${tabLabel?.label} Invoices`} showBackBtn={true} />
      <PageContainer>
        <FlatList
          style={styles.scrollContainer}
          contentContainerStyle={{
            paddingTop: 20,
          }}
          data={invoicesResult}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyResult />}
          ListHeaderComponent={listHeaderComponent}
        />
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 24,
  },
  labelText: {
    ...font(14, 16),
    color: colors.text.grayText,
  },
  totalText: {
    ...font(16, 18, '500'),
    color: colors.text.darkGrayText,
  },
});
