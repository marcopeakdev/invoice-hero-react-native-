import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { Header } from '../components/Header';
import { RouteProp } from '@react-navigation/native';
import { HomeStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvoiceStatus, InvoiceTab } from '../models/invoice';
import { InvoiceSmallCard } from '../components/InvoiceSmallCard';
import { colors } from '../styles/colors';
import { useSelector } from 'react-redux';
import { EmptyResult } from '../components/EmptyResult';
import { font } from '../styles/font';
import { CustomTabs } from '../components/CustomTabs';
import { HomeRouterParamList } from '../navigation/HomeStackNavigator';
import RealmContext from '../database/RealmContext';
import { selectUser } from '../store/selectors/user';
import { BSON } from 'realm';
import { HeaderSearchAnimated } from '../components/HeaderSearchAnimated';

const { useQuery } = RealmContext;

type Props = {
  route: RouteProp<HomeRouterParamList, HomeStackRouteNames.InvoiceSearchByCategory>;
  navigation: NativeStackNavigationProp<
    HomeRouterParamList,
    HomeStackRouteNames.InvoiceSearchByCategory
  >;
};

export const InvoiceSearchByCategory: React.FC<Props> = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState<string>(InvoiceTab.All);
  const [searchTerm, setSearchTerm] = useState('');

  const user = useSelector(selectUser)
  const invoiceItems = useQuery('invoices')

  const queryString = useMemo(() => {
    let _queryString = `user == $0 && isDeleted != true && category._id IN {${route.params.request.categories?.map(item => `oid(${new BSON.ObjectID(item)})`).join(",")}}`// && status IN {"${InvoiceStatus.Paid}"} && category._id IN {${route.params.request.categories?.map(item => `oid(${new BSON.ObjectID(item)})`).join(",")}}`

    if (searchTerm) {
      _queryString += ` && ( number CONTAINS[c] "${searchTerm}"`
      _queryString += ` or billTo.name CONTAINS[c] "${searchTerm}")`
    }

    switch (activeTab) {
      case InvoiceTab.Paid:
        _queryString += `&& status IN {"${InvoiceStatus.Paid}"}`
        break;
      case InvoiceTab.UnPaid:
        _queryString += `&& status IN {"${InvoiceStatus.Unpaid}"}`
        break;
      default:
        _queryString += `&& status IN {${route.params.request.statuses?.map(status => `"${status}"`).join(",")}}`
        break;
    }

    return _queryString

  }, [searchTerm, activeTab, route])

  const invoicesResult = useMemo(() => {
    return invoiceItems.filtered(queryString, new BSON.ObjectID(user?._id))
  }, [invoiceItems, queryString])

  const renderItem = useCallback(({ item }: any) => {
    const tempItem = item.toJSON();
    return <InvoiceSmallCard item={{
      ...tempItem,
      client: item.billTo
    }} />;
  }, []);

  return (
    <View style={styles.container}>
      <Header title={route?.params?.title || 'Invoices'} showBackBtn={true}
        rightSideComponent={
          <HeaderSearchAnimated
            onSearch={setSearchTerm}
          />
        }
      >
        <CustomTabs
          tabs={[InvoiceTab.All, InvoiceTab.Paid, InvoiceTab.UnPaid]}
          active={activeTab}
          setActiveTab={e => {
            setActiveTab(e)
          }}
        />
      </Header>
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: -30,
          borderTopEndRadius: activeTab === InvoiceTab.Paid || activeTab === InvoiceTab.All ? 20 : 0,
          borderTopLeftRadius: activeTab === InvoiceTab.Paid || activeTab === InvoiceTab.UnPaid ? 20 : 0,
          paddingTop: 12,
          display: 'flex',
          flex: 1
        }}>
        <FlatList
          style={{ ...styles.scrollContainer, height: 200 }}
          data={invoicesResult}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyResult />}
        />
      </View>
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
    shadowRadius: 15,
    elevation: 15,
  },
  pageTitleContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  pageTitle: {
    ...font(20, 22, '500'),
    color: colors.text.darkGrayText,
    flex: 1,
  },
  newInvoiceBtn: {
    paddingHorizontal: 25,
    width: 'auto',
    alignItems: 'center',
  },
});
