import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { InvoiceStatus } from '../models/invoice';
import { colors } from '../styles/colors';
import { useSelector } from 'react-redux';
import { EmptyResult } from '../components/EmptyResult';
import { font } from '../styles/font';
import RealmContext from '../database/RealmContext';
import { selectUser } from '../store/selectors/user';
import { BSON } from 'realm';
import { ExpenseSmallCard } from './ExpenseSmallCard';
import { EmptyExpense } from './EmptyExpense';
import { ExpenseTotalCard } from './ExpenseTotalCard';
const { useQuery } = RealmContext;

type Props = {
  isEstimate?: boolean;
  searchTerm?: string;
  clients?: string[];
};


export const ExpenseOverview: React.FC<Props> = ({ searchTerm, clients, isEstimate }) => {
  const user = useSelector(selectUser);


  const statuses = useMemo(() => {
    return isEstimate ? [InvoiceStatus.Estimate] : [InvoiceStatus.Paid, InvoiceStatus.Unpaid, InvoiceStatus.PartiallyPaid]
  }, [isEstimate])

  const filterString = useMemo(() => {
    let queryString = 'user == $0 && isDeleted != true'

    if (searchTerm) {
      queryString += ` && ( purpose CONTAINS[c] "${searchTerm}"`
      queryString += ` or merchant.name CONTAINS[c] "${searchTerm}")`
    }

    return queryString;
  }, [user, searchTerm, statuses])

  const items = useQuery('expenses').filtered(filterString, new BSON.ObjectID(user?._id))

  const renderItem = useCallback(({ item }: any) => {
    return <ExpenseSmallCard item={item} isExpensive={true} />;
  }, []);


  return (
    <View style={styles.container}>
      <ExpenseTotalCard items={items} />
      <FlatList
        style={styles.scrollContainer}
        contentContainerStyle={{
          paddingTop: 20,
        }}
        data={items}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyExpense description='Create Your first expense!' />}
      />
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
