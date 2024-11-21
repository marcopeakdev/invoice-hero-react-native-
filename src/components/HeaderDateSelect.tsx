import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment, { Moment } from 'moment';
import DatePicker from 'react-native-date-picker';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { ArrowDownIcon } from './icons/ArrowDown';

type Props = {
  onDateChange?: (date: any[]) => void;
};

export const HeaderDateSelect: React.FC<Props> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [week, setWeek] = useState<Moment[]>([]);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  useEffect(() => {
    const currentDate = moment().startOf('day');
    console.log(currentDate);

    setSelectedDate(currentDate.clone());

    setCurrentMonth(currentDate.clone().format('MMMM yyyy'));
    const start = currentDate.clone().startOf('week');
    const end = currentDate.clone().endOf('week');
    const days = [];

    while (start.isSameOrBefore(end)) {
      days.push(start.clone());
      start.add(1, 'day');
    }
    if (onDateChange) {
      onDateChange([
        moment(currentDate).startOf('week').valueOf(),
        moment(currentDate).endOf('week').valueOf(),
      ]);
    }
    setWeek(days);
  }, []);

  const setWeeksDays = (date: Moment) => {
    if (date && date.isSame(selectedDate)) {
      setSelectedDate(null);
      const currentDate = moment(date).startOf('day');

      if (onDateChange) {
        onDateChange([
          moment(currentDate).startOf('week').valueOf(),
          moment(currentDate).endOf('week').valueOf(),
        ]);
      }
      return;
    }

    if (onDateChange) {
      onDateChange([
        moment(date).startOf('day').valueOf(),
        moment(date).endOf('day').valueOf(),
      ]);
    }

    setSelectedDate(date.clone());

    setCurrentMonth(date.clone().format('MMMM yyyy'));
    const start = date.clone().startOf('week');
    const end = date.clone().endOf('week');
    const days = [];

    while (start.isSameOrBefore(end)) {
      days.push(start.clone());
      start.add(1, 'day');
    }

    setWeek(days);
  };

  const setWeekDaysOnly = (date: Moment) => {
    if (onDateChange) {
      onDateChange([
        moment(date).startOf('week').valueOf(),
        moment(date).endOf('week').valueOf(),
      ]);
    }

    setCurrentMonth(date.clone().format('MMMM yyyy'));
    const start = date.clone().startOf('week');
    const end = date.clone().endOf('week');
    const days = [];

    while (start.isSameOrBefore(end)) {
      days.push(start.clone());
      start.add(1, 'day');
    }

    setWeek(days);
  };

  const weeksView = useMemo(() => {
    return week.map(date => {
      return (
        <View key={`week_${date.format('ddd')}`} style={styles.dayContainer}>
          <Text style={styles.dayLabel}>{date.format('ddd')}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setWeeksDays(date)}
            style={[
              styles.dayDateContainer,
              date.format('d') === selectedDate?.format('d') &&
              styles.dayDateContainerActive,
            ]}>
            <Text
              style={[
                styles.dayDate,
                date.format('d') === selectedDate?.format('d') &&
                styles.dayDateActive,
              ]}>
              {date.format('DD')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  }, [week, selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() =>
            selectedDate ? setWeeksDays(selectedDate.clone().add(-1, 'week')) : setWeekDaysOnly(week[0].add(-1, 'week'))
          }
          style={styles.actionWeek}>
          <Text style={styles.actionWeekText}>Previous week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOpenDatePicker(state => !state)}
          activeOpacity={0.7}
          style={styles.actionCalendar}>
          <Text style={styles.actionCalendarText}>{currentMonth}</Text>
          <View style={styles.actionCalendarIcon}>
            <ArrowDownIcon color={colors.text.whiteTextOpacity[50]} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            selectedDate ? setWeeksDays(selectedDate!.clone().add(1, 'week')) : setWeekDaysOnly(week[6].add(1, 'week'))
          }
          style={styles.actionWeek}>
          <Text style={styles.actionWeekText}>Next week</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekContainer}>{weeksView}</View>
      <DatePicker
        modal
        mode={'date'}
        androidVariant={'nativeAndroid'}
        open={openDatePicker}
        date={selectedDate?.toDate() || new Date()}
        onConfirm={d => {
          setOpenDatePicker(false);
          setWeeksDays(moment(d));
        }}
        onCancel={() => setOpenDatePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionWeek: {},
  actionWeekText: {
    ...font(12, 18, '500'),
    color: colors.text.whiteText,
  },
  actionCalendar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCalendarText: {
    ...font(14, 21, '500'),
    color: colors.text.whiteText,
    textTransform: 'uppercase',
  },
  actionCalendarIcon: {
    marginLeft: 4,
    transform: [{ rotate: '180deg' }],
  },
  weekContainer: {
    flexDirection: 'row',
  },
  dayContainer: {
    textAlign: 'center',
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    ...font(12, 18, '600'),
    color: colors.text.whiteTextOpacity[30],
    marginBottom: 13,
    textTransform: 'uppercase',
  },
  dayDateContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDateContainerActive: {
    backgroundColor: colors.whiteColor,
  },
  dayDate: {
    // ...font(13, 14, '600'),
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.whiteText,
  },
  dayDateActive: {
    color: colors.text.blue2,
  },
});
