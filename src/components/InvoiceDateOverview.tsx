import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { DateOverview, InvoiceStatus } from '../models/invoice';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { EmptyResult } from './EmptyResult';
import { ArrowDownIcon } from './icons/ArrowDown';
import { InvoiceOverview } from '../dto/invoices';
import { InvoiceSmallCard } from './InvoiceSmallCard';
import { InvoiceSchema } from '../database/InvoiceSchema';
import { selectUser } from '../store/selectors/user';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';

const { useQuery } = RealmContext;

type Props = {
  date?: number[] | null;
  statuses: InvoiceStatus[];
  searchTerm?: string,
  clients?: string[]
};

export const InvoiceDateOverview: React.FC<Props> = ({
  date = [],
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
  searchTerm,
  clients
}) => {

  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [invoiceResult, setInvoiceResult] = useState<any>([])

  const user = useSelector(selectUser)

  const filterString = useMemo(() => {
    let queryString = 'user == $0 && isDeleted != true'
    if (!date) {
      return queryString;
    }
    if (searchTerm) {
      queryString += ` && ( number CONTAINS[c] "${searchTerm}"`
      queryString += ` or billTo IN {${(clients || []).map((id: any) => new BSON.ObjectID(id)).join(',')}})`
    }

    return queryString;
  }, [user, searchTerm, date, clients]);
  const invoices = useQuery('invoices').filtered(filterString, new BSON.ObjectID(user?._id));
  
  useEffect(() => {
    if (!date) {
      return;
    }
    let result: any = [];
    if (date.length) {
      result = invoices.filter((item: any) => new Date(item.date).toISOString() >= new Date(date[0]).toISOString() && new Date(item.date).toISOString() <= new Date(date[1]).toISOString());
    }
    setInvoiceResult(result)

    setActiveSections([0]);
  }, [date, searchTerm]);

  const formattedDateOverview = useMemo(() => {
    const dates: any = invoiceResult || [];
    const start = dates.length
      ? moment(dates[0].date).endOf('month')
      : moment().endOf('month');
    const end = dates[dates.length - 1]
      ? moment(dates[dates.length - 1].date).startOf('month')
      : moment().startOf('month');

    const result = [];
    while (start.isSameOrAfter(end)) {
      const items = dates.filter((d: any) => moment(d.date).isSame(start, 'month'));
      if (items.length) {
        result.push({ title: start.format('MMMM, yyyy'), items });
      }
      start.subtract(1, 'month');
    }
    console.log('possible', start);
    console.log('possible', end);
    return result;
  }, [invoiceResult]);

  const renderHeader = ({ title }: any, index: number) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View
          style={[
            styles.sectionIcon,
            !activeSections.includes(index) && styles.sectionIconActive,
          ]}>
          <ArrowDownIcon color={colors.gray} />
        </View>
      </View>
    );
  };

  const renderContent = (section: any) => {
    return (
      <View style={styles.content}>
        {(section.items || []).map((item: DateOverview) => {
          return (
            <InvoiceSmallCard
              key={`invoice_date_card_${item._id}`}
              item={item}
            />
          );
        })}
      </View>
    );
  };

  const onChange = (indexes: any) => {
    setActiveSections(indexes);
  };


  if (!formattedDateOverview.length) {
    return <EmptyResult />;
  }

  return (
    <View style={styles.container}>
      <Accordion
        activeSections={activeSections}
        sections={formattedDateOverview}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={onChange}
        underlayColor={'transparent'}
        expandMultiple={true}
      />
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
  section: {
    height: 56,
    marginHorizontal: 24,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionIcon: {},
  sectionIconActive: {
    transform: [{ rotate: '180deg' }],
  },
  sectionTitle: {
    color: colors.text.grayText,
    ...font(16, 24),
  },
  content: {
    paddingTop: 20,
  },
});
