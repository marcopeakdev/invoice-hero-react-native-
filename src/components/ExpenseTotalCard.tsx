import React, { useMemo } from 'react';
import { Card } from './Card';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { currencyFormatter } from '../utils/currency';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

type Props = {
  items: any;
};

export const ExpenseTotalCard: React.FC<Props> = React.memo(({ items }) => {
  const total = useMemo(() => {
    return items.reduce((sum: number, item: any) => {
      return sum + item.total;
    }, 0);
  }, [items]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => { }}>
      <Card containerStyle={styles.shadowCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingRight: 10, }}>
            <View style={styles.cardInnerContainerRow}>
              <Text style={styles.invoiceClient}>
                Total
              </Text>
            </View>
            <View style={[styles.cardInnerContainerRow, { marginTop: 0 }]}>
              <Text style={styles.invoiceSum}>
                {currencyFormatter.format(total || 0)}
              </Text>
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
    ...font(16, 30, '600'),
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
