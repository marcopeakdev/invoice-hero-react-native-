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

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddExpenseDate>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddExpenseDate
  >;
};

type Values = {
  date: any;
};

export const AddExpenseDate: React.FC<Props> = ({ route, navigation }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [value, setValue] = useState<Values>(
    route.params.value || {
      date: null,
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
  }, [route]);

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
        <ScrollView style={styles.container}>
          <FormField
            onPress={() => setOpenDatePicker(true)}
            label={'Date'}
            containerStyle={styles.field}>
            <View style={commonView.cardRow}>
              {value.date ? (
                <Text style={commonView.cardRowValue}>
                  {moment(value.date).format('MMM DD, yyyy')}
                </Text>
              ) : (
                <Text style={commonView.cardRowPlaceholder}>
                  Add Expense Date
                </Text>
              )}
              <CalendarIcon />
            </View>
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
