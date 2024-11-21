import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { CategoryOverview, InvoiceStatus } from '../models/invoice';
import { currencyFormatter } from '../utils/currency';
import { colors } from '../styles/colors';
import { Card } from './Card';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useNavigation } from '@react-navigation/native';
import { HomeStackRouteNames, MainBottomTabsRouteNames } from '../navigation/router-names';
import { commonView } from '../styles/common';
import { font } from '../styles/font';
import { selectUser } from '../store/selectors/user';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';

const { useQuery } = RealmContext;

type Props = {
  categories?: string[];
  statuses: InvoiceStatus[];
  isHomeScreen?: boolean;
};

export const InvoiceCategoriesOverview: React.FC<Props> = ({
  categories = [],
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
  isHomeScreen = false
}) => {
  const navigation = useNavigation<any>();

  const user = useSelector(selectUser)

  const invoiceItems = useQuery('invoices');
  const ownInvoiceItems = invoiceItems.filtered('user == $0 && isDeleted != true', new BSON.ObjectID(user?._id))

  const sortedCategories = useMemo(() => {
    let result: CategoryOverview[] = []
    let _sortedCategories: any[] = [];

    if (categories.length) {
      _sortedCategories = categories
    } else {
      _sortedCategories = invoiceItems.filtered('user == $0 && isDeleted != true DISTINCT(category)', new BSON.ObjectID(user?._id)).toJSON().map(item => item.category);
    }

    _sortedCategories.forEach(item => {
      let queryString = `status IN {${statuses.map(status => `"${status}"`).join(',')}}`
      queryString += `&& ${item ? `category._id == oid(${new BSON.ObjectID(item?._id)})` : 'billTo == null'} `
      const resultItems = ownInvoiceItems.filtered(queryString)
      const sum = resultItems.sum('total');
      result.push({
        _id: item?._id.toString(),
        category: item,
        sum
      })
    })
    return result;
  }, [categories, statuses, ownInvoiceItems]);

  const renderInvoiceCategoryCell = (item: CategoryOverview) => {
    return <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate(HomeStackRouteNames.InvoiceSearchByCategory, {
          title: item?.category?.name,
          request: {
            categories: [item._id],
            statuses: [InvoiceStatus.Unpaid, InvoiceStatus.Paid],
          },
        })
      }
      key={`invoice_categories_${item._id}`}
      style={[styles.touchableCard, commonView.commonShadow]}>
      <Card containerStyle={styles.card}>
        <Text style={styles.categoryName}>
          {item?.category?.name || 'None'}
        </Text>
        <Text style={styles.categorySum}>
          {currencyFormatter.format(item.sum)}
        </Text>
        <View style={styles.icon}>
          <ArrowLeftIcon color={'#D1D5DB'} />
        </View>
      </Card>
    </TouchableOpacity>
  }

  return (
    <View style={styles.container}>
      {sortedCategories.map((item: CategoryOverview, index) => {
        if (isHomeScreen) {
          return index < 4 ? (
            renderInvoiceCategoryCell(item)
          ) : null
        }
        return renderInvoiceCategoryCell(item)
      })}
      {isHomeScreen && (
        <TouchableOpacity
          key={`invoice_categories_view_all`}
          style={{ width: 150, alignSelf: 'center', paddingHorizontal: 24, alignItems: 'center' }}
          onPress={() => {
            navigation.jumpTo(MainBottomTabsRouteNames.Invoices, {
              defaultTab: 'Categories'
            })
          }}
        >
          <Text style={styles.viewAllTextButton}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableCard: {
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  categoryName: {
    ...font(14, 16, '500'),
    color: colors.text.darkGrayText,
    flex: 1,
  },
  categorySum: {
    ...font(16, 18, '500'),
    color: colors.text.black,
  },
  icon: {
    marginLeft: 24,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  viewAllTextButton: {
    ...font(14, 16, '500'),
    color: colors.text.blue,
    textAlign: 'left'
  }
});
