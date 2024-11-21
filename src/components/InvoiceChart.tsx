import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { InvoiceStatus } from '../models/invoice';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';
import { selectUser } from '../store/selectors/user';

const { useQuery } = RealmContext;

const screenWidth = Dimensions.get("window").width;
type Props = {};

const statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid];

export const InvoiceChart: React.FC<Props> = () => {
  const [activeDot, setActiveDot] = useState<any>(null);
  const chartContainer = useRef<ScrollView>(null);

  const user = useSelector(selectUser)
  const invoiceItems = useQuery('invoices')
  const ownInvoiceItems = invoiceItems.filtered('user == $0 && isDeleted != true', new BSON.ObjectID(user?._id))

  useEffect(() => {
    const d = new Date();
    let month = d.getMonth();
    chartContainer.current?.scrollTo({ x: (month + 1) * (856) / 24 - 20, animated: false })
  }, []);

  const calculations = useMemo(() => {
    let unpaid = new Array(12).fill(0);
    let paid = new Array(12).fill(0);

    ownInvoiceItems.toJSON().forEach((invoice: any) => {
      const monthIndex = moment(invoice.date).month();
      if (invoice.status === InvoiceStatus.Paid) {
        paid[monthIndex] += invoice.total || 0;
      } else if (invoice.status === InvoiceStatus.Unpaid) {
        unpaid[monthIndex] += invoice.total || 0;
      }
    });

    return {
      paid,
      unpaid,
    };
  }, [ownInvoiceItems]);

  const dataSet = useMemo(() => {
    return [
      {
        data: calculations.paid,
        color: () => 'rgba(88, 153, 248, 1)',
        strokeWidth: 3,
      },
      {
        data: calculations.unpaid,
        color: () => 'rgba(205, 215, 235, 1)',
        strokeWidth: 3,
      },
    ]
  }, [calculations])

  return (
    <View style={styles.container}>
      <ScrollView
        ref={chartContainer}
        horizontal={true}>
        <LineChart
          data={{
            labels: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            datasets: dataSet
          }}
          width={856}
          height={260}
          withOuterLines={false}
          withInnerLines={true}
          xLabelsOffset={0}
          withVerticalLines={false}
          withHorizontalLabels={false}
          decorator={() => {
            if (!activeDot) {
              return null;
            }

            const label =
              activeDot.getColor() === 'rgba(205, 215, 235, 1)'
                ? 'Unpaid'
                : 'Paid';

            return (
              <View
                style={[
                  styles.dotContainer,
                  {
                    left: activeDot.x,
                    top: activeDot.y - 30,
                    transform: [{ translateX: -15 }],
                  },
                ]}>
                <Text style={styles.dotText}>
                  {label}: ${activeDot.dataset.data[activeDot.index]}
                </Text>
              </View>
            );
          }}
          onDataPointClick={value => setActiveDot(value)}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            fillShadowGradientFrom: '#B0D4FF',
            fillShadowGradientFromOpacity: 1,
            fillShadowGradientTo: '#B0D4FF',
            fillShadowGradientToOpacity: 0,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: () => colors.text.darkGrayText,
            style: {
              borderRadius: 0,
            },
            propsForBackgroundLines: {
              stroke: '#e6e6e6',
              strokeWidth: '1',
              strokeDasharray: 'none',
            },
            propsForDots: {
              r: '5',
              strokeWidth: '3',
              stroke: '#fff',
              fill: '#5899F8',
            },
          }}
          bezier
          style={{
            paddingTop: 20,
            marginVertical: 8,
            marginLeft: -40,
            borderRadius: 0,
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    backgroundColor: colors.whiteColor,
  },
  dotContainer: {
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: 'absolute',

    shadowColor: 'rgba(73, 73, 73)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dotText: {
    ...font(10, 15, '500'),
    color: colors.bluePrimary,
  },
});
