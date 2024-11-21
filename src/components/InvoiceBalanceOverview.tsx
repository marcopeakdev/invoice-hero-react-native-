import React, { useMemo } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BalanceOverview, InvoiceStatus } from '../models/invoice';
import { currencyFormatter } from '../utils/currency';
import { colors } from '../styles/colors';
import { Card } from './Card';
import { useNavigation } from '@react-navigation/native';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { commonView } from '../styles/common';
import { font } from '../styles/font';
import { selectUser } from '../store/selectors/user';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';

const { useQuery, useRealm } = RealmContext

type Props = {
  isHorizontal?: boolean;
  statuses: InvoiceStatus[];
  callback?: () => void;
};

type ContainerProps = {
  children: React.ReactNode;
};

const gap = 15;
const windowWidth = Dimensions.get('window').width - 48;

export const InvoiceBalanceOverview: React.FC<Props> = ({
  isHorizontal = false,
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid, InvoiceStatus.PartiallyPaid]
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();


  const user = useSelector(selectUser)

  const ownInvoiceItems = useQuery('invoices').filtered('user == $0 && isDeleted != true', new BSON.ObjectID(user?._id))

  const itemPerRow = useMemo(() => {
    return isHorizontal ? 2.5 : 2
  }, [isHorizontal])

  const totalGapSize = useMemo(() => {
    return (itemPerRow - 1) * gap;
  }, [itemPerRow])

  const childWidth = useMemo(() => {
    return (windowWidth - totalGapSize) / itemPerRow;
  }, [itemPerRow])

  const balanceBlock = useMemo(() => {
    return {
      width: childWidth,
      marginVertical: gap / 2,
      marginHorizontal: gap / 2,
      paddingHorizontal: gap / 2
    }
  }, [])

  const sortedResult = useMemo(() => {

    const sortedArray = [InvoiceStatus.Paid, InvoiceStatus.Unpaid, InvoiceStatus.PartiallyPaid, InvoiceStatus.Estimate]
    let result: BalanceOverview[] = []
    sortedArray.forEach(item => {
      const seletectedStatus = statuses.find(_item => _item === item)
      if (seletectedStatus) {
        const statusItems = ownInvoiceItems.filtered(`status == "${seletectedStatus}"`)
        const sum = statusItems.sum('total')
        const sumDeposit = statusItems.sum('deposit');
        result.push({
          sum,
          _id: seletectedStatus,
          sumDeposit
        })
      }
    })
    return result
  }, [ownInvoiceItems])

  const getStyle = (type: InvoiceStatus) => {
    switch (type) {
      case InvoiceStatus.Paid:
        return styles.Paid;
      case InvoiceStatus.Unpaid:
        return styles.Unpaid;
      case InvoiceStatus.PartiallyPaid:
        return styles.PartiallyPaid;
      default:
        return null;
    }
  };

  const getLabel = (type: InvoiceStatus) => {
    switch (type) {
      case InvoiceStatus.Paid:
        return 'Fully Paid';
      case InvoiceStatus.Unpaid:
        return 'UnPaid';
      case InvoiceStatus.PartiallyPaid:
        return 'Partially Paid'
      case InvoiceStatus.Estimate:
        return 'Estimate';
      default:
        return null;
    }
  };

  const Container: React.FC<ContainerProps> = ({ children }) => {
    if (isHorizontal) {
      return <ScrollView
        style={{ maxHeight: 110 }}
        contentContainerStyle={{ maxHeight: 110 }}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      >
        {children}
      </ScrollView>
    } else {
      return (<View style={styles.container}>
        {children}
      </View>)
    }
  }

  return (
    <Container>
      {sortedResult.map((item: BalanceOverview) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate(MainStackRouteNames.InvoiceList, {
                activeTab: item._id,
              })
            }
            }
            key={`balance_${item._id}`}>
            <Card
              containerStyle={[balanceBlock, commonView.commonShadow]}>
              <Text style={styles.balanceBlockTitle}>{getLabel(item._id as InvoiceStatus)}</Text>
              <Text
                style={[
                  styles.balanceBlockValue,
                  getStyle(item._id as InvoiceStatus),
                ]}>
                {currencyFormatter.format(item._id === InvoiceStatus.PartiallyPaid ? item?.sumDeposit : item?.sum)}
              </Text>
            </Card>
          </TouchableOpacity>
        );
      })}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: -(gap / 2),
    marginHorizontal: -(gap / 2),
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  touchable: {},
  balanceBlockTitle: {
    ...font(12, 18),
    color: colors.text.grayText,
    marginBottom: 2,
  },
  balanceBlockValue: {
    ...font(16, 24, '500'),
    color: colors.text.darkGrayText,
  },
  Paid: {
    color: colors.text.green,
  },
  Unpaid: {
    color: colors.text.red,
  },
  PartiallyPaid: {
    color: colors.text.yellow,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
