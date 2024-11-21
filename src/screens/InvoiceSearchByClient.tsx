import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { BSON } from 'realm';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { RouteProp } from '@react-navigation/native';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { InvoiceSmallCard } from '../components/InvoiceSmallCard';
import { colors } from '../styles/colors';
import { BtnType, Button } from '../components/Button';
import { PlusIcon } from '../components/icons/PlusIcon';
import { EmptyResult } from '../components/EmptyResult';
import { font } from '../styles/font';
import { HeaderSearchAnimated } from '../components/HeaderSearchAnimated';
import { EditIcon } from '../components/icons/EditIcon';
import RealmContext from '../database/RealmContext';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/selectors/user';

const { useQuery } = RealmContext;
type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceSearchByClient
  >;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.InvoiceSearchByClient,
    MainStackRouteNames.ClientCreate
  >;
};

export const InvoiceSearchByClient: React.FC<Props> = ({ route, navigation }) => {
  const user = useSelector(selectUser)
  const invoiceItems = useQuery('invoices')
  const [searchTerm, setSearchTerm] = useState('')

  const queryString = useMemo(() => {
    let _queryString = `user == $0 && isDeleted != true && billTo._id IN {${route.params.request.clients?.map((item: any) => `oid(${new BSON.ObjectID(item)})`).join(",")}}`
    if (route.params.request.statuses) {
      _queryString += `&& status IN {${route.params.request.statuses?.map((status:any) => `"${status}"`).join(",")}}`
    }

    if (searchTerm) {
      _queryString += ` && ( number CONTAINS[c] "${searchTerm}"`
      _queryString += ` or billTo.name CONTAINS[c] "${searchTerm}")`
    } 

    return _queryString
  }, [route, searchTerm])

  const invoicesResult = useMemo(() => {
    return invoiceItems.filtered(queryString, new BSON.ObjectID(user?._id))
  }, [queryString, invoiceItems])

  const renderItem = useCallback(({ item }: any) => {
    return <InvoiceSmallCard item={item.toJSON()} />;
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
      </Header>
      <PageContainer>
        <View style={styles.pageTitleContainer}>
          <Button
            text={'Edit Profile'}
            icon={<EditIcon size={18} color={colors.whiteColor} />}
            type={BtnType.Primary}
            containerStyle={styles.newInvoiceBtn}
            onPress={() => {
              if (route.params?.request?.clients?.length) {
                navigation.navigate(MainStackRouteNames.ClientCreate, {
                  backScreen: MainStackRouteNames.InvoiceSearchByClient,
                  returnValueName: 'billTo',
                  clientId: route.params?.request?.clients[0]
                })
              }
            }}
          />
          <Button
            text={'New Invoice'}
            icon={<PlusIcon size={18} color={colors.whiteColor} />}
            type={BtnType.Primary}
            containerStyle={styles.newInvoiceBtn}
            onPress={() =>
              navigation.navigate(MainStackRouteNames.InvoiceSingle)
            }
          />
        </View>
        <FlatList
          style={{ ...styles.scrollContainer }}
          data={invoicesResult}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyResult />}
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
