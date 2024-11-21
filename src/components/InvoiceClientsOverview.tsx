import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ClientOverview, InvoiceStatus } from '../models/invoice';
import { currencyFormatter } from '../utils/currency';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { Card } from './Card';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useNavigation } from '@react-navigation/native';
import { MainBottomTabsRouteNames, MainStackRouteNames } from '../navigation/router-names';
import { selectUser } from '../store/selectors/user';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';

const { useQuery } = RealmContext;

type Props = {
  clients?: string[];
  statuses: InvoiceStatus[];
  isHomeScreen?: boolean;
};

export const InvoiceClientsOverview: React.FC<Props> = ({
  clients = [],
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
  isHomeScreen = false
}) => {
  const navigation = useNavigation<any>();

  const user = useSelector(selectUser)

  const invoiceItems = useQuery('invoices');
  const ownInvoiceItems = invoiceItems.filtered('user == $0 && isDeleted != true', new BSON.ObjectID(user?._id))
  const ownClients = useQuery('clients').filtered('user == $0 && status == "Active"', new BSON.ObjectID(user?._id)).sorted('name',true)


  const sortedClients = useMemo(() => {
    let result: ClientOverview[] = []
    let _sortedClients: any[] = [];

    if (clients.length) {
      _sortedClients = clients
    } else {
      _sortedClients = ownClients.toJSON()
    }

    _sortedClients.forEach(item => {
      let queryString = `status IN {${statuses.map(status => `"${status}"`).join(',')}}`
      queryString += `&& ${item ? `billTo._id == oid(${new BSON.ObjectID(item?._id)})` : 'billTo == null'} `
      const resultItems = ownInvoiceItems.filtered(queryString)
      const sum = resultItems.sum('total');
      result.push({
        _id: item?._id.toString(),
        client: item,
        sum
      })
    })
    return result;
  }, [clients, statuses, ownInvoiceItems]);


  const renderInvoiceClientCell = (item: ClientOverview) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={`invoice_client_${item._id}`}
        onPress={() => {
          navigation.navigate(MainStackRouteNames.InvoiceSearchByClient, {
            title: item?.client?.name || 'None',
            request: {
              clients: item?.client?._id ? [item?.client?._id] : [null],
              statuses: [InvoiceStatus.Unpaid, InvoiceStatus.Paid],
            },
          })
        }
        }
        style={styles.shadowCard}>
        <Card containerStyle={styles.card}>
          <Text style={styles.clientName}>
            {item?.client?.name || 'None'}
          </Text>
          <Text style={styles.clientSum}>
            {currencyFormatter.format(item.sum)}
          </Text>
          <View style={styles.icon}>
            <ArrowLeftIcon color={'#D1D5DB'} />
          </View>
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {sortedClients.map((item: ClientOverview, index) => {
        if (isHomeScreen) {
          return index < 4 ? (
            renderInvoiceClientCell(item)
          ) : null
        } else {
          return renderInvoiceClientCell(item)
        }
      })}
      {isHomeScreen && (
         <TouchableOpacity
         key={`invoice_client_view_all`}
         style={{ width: 150, alignSelf: 'center', paddingHorizontal: 24, alignItems: 'center' }}
         onPress={() => {
           navigation.jumpTo(MainBottomTabsRouteNames.Invoices, {
             defaultTab: 'Clients'
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
  container: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowCard: {
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  clientName: {
    ...font(14, 16, '500'),
    color: colors.text.darkGrayText,
    flex: 1,
  },
  clientSum: {
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
