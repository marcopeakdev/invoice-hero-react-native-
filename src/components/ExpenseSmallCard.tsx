import React from 'react';
import { MainStackRouteNames } from '../navigation/router-names';
import { Card } from './Card';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { currencyFormatter } from '../utils/currency';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { DateOverview, Invoice, InvoiceStatus} from '../models/invoice';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { Expense, ExpenseDateOverview } from '../models/expense';

type Props = {
  callback?: () => void;
  isExpensive: boolean;
  item:
  | (Expense & {
    merchant: {
      name: string;
    };
  })
  | ExpenseDateOverview;
};

export const ExpenseSmallCard: React.FC<Props> = React.memo(({ item, callback, isExpensive = false }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate(MainStackRouteNames.ExpenseSingle, {
          title: item?.purpose,
          id: item._id.toString(),
          callback
        })
      }}>
      <Card containerStyle={styles.shadowCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={styles.cardInnerContainerRow}>
              <View>
                <Text style={styles.invoiceNumber}>{item?.purpose}</Text>
                <Text style={styles.invoiceClient}>
                  {item?.merchant?.name ?? '-'}
                </Text>
              </View>
              <Text style={styles.invoiceSum}>
                {currencyFormatter.format(item.total || 0)}
              </Text>
            </View>
            <View style={[styles.cardInnerContainerRow, { marginTop: 0 }]}>
              <View>
                <Text style={styles.invoiceDate}>
                  {item.date ? moment(item.date).format('DD/MM/yyyy') : '-'}
                </Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'flex-end' }}>
                <View style={[styles.invoiceStatusBlock]}>
                  <Text style={[styles.invoiceStatusText]}>Expense</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginLeft: 10 }}>
            <ArrowRightIcon />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  shadowCard: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 6,
    marginHorizontal: 24,
  },
  cardInnerContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceNumber: {
    color: colors.text.darkGrayText,
    ...font(12, 18, '500'),
  },
  invoiceClient: {
    color: colors.text.darkGrayText,
    ...font(14, 21, '600'),
  },
  invoiceDate: {
    color: colors.text.darkGrayText,
    ...font(14, 18, '500'),
  },
  paidDate: {
    color: colors.text.darkGrayText,
    ...font(12, 18, '500'),
  },
  invoiceSum: {
    color: colors.text.darkGrayText,
    ...font(20, 30, '600'),
  },
  invoiceStatusBlock: {
    height: 27,
    paddingHorizontal: 13,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGreen,
  },
  invoiceStatusText: {
    ...font(14, 16, '600'),
    color: colors.bluePrimary,
  },
  unpaidBlock: {
    backgroundColor: colors.lightRed,
  },
  partiallyPaidBlock: {
    backgroundColor: colors.lightYellow,
  },
  paidBlock: {
    backgroundColor: colors.lightGreen,
  },
  estimateBlock: {},
  unpaidText: {
    color: colors.red,
  },
  partiallyPaidText: {
    color: colors.text.yellow
  },
  paidText: {
    color: colors.green,
  },
  estimateText: {},
});
