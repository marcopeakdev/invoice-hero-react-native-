import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BtnType, Button } from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormField } from '../components/FormField';
import { commonView } from '../styles/common';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

const recurringPeriods = new Array(12).fill(0).map((_, index) => {
  return {
    label: `Every ${index + 1} months`,
    value: index + 1,
  };
});

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoiceDate>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddInvoiceDate
  >;
};

type Values = {
  date: any;
  dueDate: any;
  recurringPeriod: number | null;
};

export const AddInvoiceDate: React.FC<Props> = ({ route, navigation }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openDueDatePicker, setOpenDueDatePicker] = useState(false);
  const [value, setValue] = useState<Values>(
    route.params.value || {
      date: null,
      dueDate: null,
      recurringPeriod: null,
    },
  );

  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }

    if (route.params?.recurringPeriod) {
      setValue(state => {
        return {
          ...state,
          recurringPeriod: route.params.recurringPeriod,
        };
      });
    }
  }, [route]);

  const onCallback = (data: (any)) => {
  if (data.recurringPeriod) {
    setValue(state => {
      return {
        ...state,
        recurringPeriod: data.recurringPeriod,
      };
    });
  }
  }

  const onSelectRecurringPeriod = () => {
    navigation.navigate(MainStackRouteNames.DropDownList, {
      title: 'Select recurring period',
      list: recurringPeriods,
      returnValueName: 'recurringPeriod',
      backScreen: MainStackRouteNames.AddInvoiceDate,
      selectedValue: value.recurringPeriod || null,
      callback: onCallback
    });
  };

  const onSave = () => {
    if (route.params.callback) {
      route.params.callback({ date: value })
      navigation.goBack();
    } else {
      navigation.navigate<any>(backScreen.current, {
        [returnValueName.current!]: value,
      });
    }

  };

  const onCancel = () => {
    navigation.navigate<any>(backScreen.current);
  };

  return (
    <View style={styles.container}>
      <Header title={'Add date'} showBackBtn={true} />
      <PageContainer>
        <DatePicker
          modal
          mode={'date'}
          androidVariant={'nativeAndroid'}
          open={openDatePicker}
          date={value.date ? new Date(value.date) : new Date()}
          onConfirm={d => {
            setOpenDatePicker(false);
            if (d) {
              setValue(state => ({
                ...state,
                date: d.toISOString(),
              }));
            }
          }}
          onCancel={() => setOpenDatePicker(false)}
        />
        <DatePicker
          modal
          mode={'date'}
          androidVariant={'nativeAndroid'}
          open={openDueDatePicker}
          date={value.dueDate ? new Date(value.dueDate) : new Date()}
          onConfirm={d => {
            setOpenDueDatePicker(false);
            if (d) {
              setValue(state => ({
                ...state,
                dueDate: d.toISOString(),
              }));
            }
          }}
          onCancel={() => setOpenDueDatePicker(false)}
        />
        <ScrollView style={styles.container}>
          <FormField
            onPress={() => setOpenDatePicker(true)}
            label={'Invoice date'}
            containerStyle={styles.field}>
            <View style={commonView.cardRow}>
              {value.date ? (
                <Text style={commonView.cardRowValue}>
                  {moment(value.date).format('MMM DD, yyyy')}
                </Text>
              ) : (
                <Text style={commonView.cardRowPlaceholder}>
                  Add invoice date
                </Text>
              )}
              <CalendarIcon />
            </View>
          </FormField>
          <FormField
            onPress={() => setOpenDueDatePicker(true)}
            label={'Due date'}
            containerStyle={styles.field}>
            <View style={commonView.cardRow}>
              {value.dueDate ? (
                <Text style={commonView.cardRowValue}>
                  {moment(value.dueDate).format('MMM DD, yyyy')}
                </Text>
              ) : (
                <Text style={commonView.cardRowPlaceholder}>Add Due date</Text>
              )}
              <CalendarIcon />
            </View>
          </FormField>
          <FormField
            onPress={onSelectRecurringPeriod}
            label={'Recurring Period'}
            containerStyle={styles.field}>
            {value.recurringPeriod ? (
              <Text style={commonView.cardRowValue}>
                Every {value.recurringPeriod} months
              </Text>
            ) : (
              <Text style={commonView.cardRowPlaceholder}>
                Add Recurring period
              </Text>
            )}
          </FormField>
        </ScrollView>
        <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            text={'Save'}
            containerStyle={styles.action}
            onPress={() => onSave()}
            disabled={!value.date}
          />
          <Button
            text={'Cancel'}
            type={BtnType.Outlined}
            containerStyle={styles.action}
            onPress={onCancel}
          />
        </View>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    paddingHorizontal: 24,
  },
  action: {
    marginTop: 16,
  },
  field: {
    marginBottom: 16,
  },
});
