import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {RouteProp} from '@react-navigation/native';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Invoice} from '../models/invoice';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {InvoiceSmallCard} from '../components/InvoiceSmallCard';
import {colors} from '../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {loadSearchInvoice} from '../store/thunk/invoices';
import {selectSearchInvoice} from '../store/selectors/invoices';
import {clearSearchInvoice} from '../store/reducers/invoices';
import {HeaderSearch} from '../components/HeaderSearch';
import {BtnType, Button} from '../components/Button';
import {PlusIcon} from '../components/icons/PlusIcon';
import {EmptyResult} from '../components/EmptyResult';
import {font} from '../styles/font';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceSearch>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.InvoiceSearch
  >;
};

export const InvoiceSearch: React.FC<Props> = ({route, navigation}) => {
  const dispatch = useDispatch<any>();
  const [page, setPage] = useState(1);
  const [request, setRequest] = useState(route?.params?.request || {});

  const invoices = useSelector(selectSearchInvoice);

  useEffect(() => {
    return () => dispatch(clearSearchInvoice());
  }, []);

  useEffect(() => {
    dispatch(
      loadSearchInvoice({
        ...request,
        page,
      }),
    );
  }, [page, request]);

  const renderItem = useCallback(({item}: any) => {
    return <InvoiceSmallCard item={item} />;
  }, []);

  return (
    <View style={styles.container}>
      <Header title={route?.params?.title || 'Invoices'} showBackBtn={true}>
        <HeaderSearch
          onSearch={searchVal => {
            setPage(1);
            dispatch(clearSearchInvoice());
            setRequest(state => {
              return {
                ...state,
                keyword: searchVal,
              };
            });
          }}
        />
      </Header>
      <PageContainer>
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle} numberOfLines={1}>
            {route?.params?.title || 'Invoices'}
          </Text>
          <Button
            text={'New Invoice'}
            icon={<PlusIcon size={18} color={colors.whiteColor} />}
            type={BtnType.Primary}
            containerStyle={styles.newInvoiceBtn}
            onPress={() =>
              navigation.navigate(MainStackRouteNames.InvoiceCreate)
            }
          />
        </View>
        {page === 1 && invoices.loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={colors.bluePrimary} />
          </View>
        ) : (
          <FlatList<Invoice>
            style={styles.scrollContainer}
            data={invoices.result}
            renderItem={renderItem}
            ListEmptyComponent={<EmptyResult />}
            onEndReached={() => {
              if (
                invoices.loading ||
                invoices.total <= invoices.result.length
              ) {
                return;
              }

              setPage(state => state + 1);
            }}
          />
        )}
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
