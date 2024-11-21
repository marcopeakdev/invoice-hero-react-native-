import React, { useEffect, useRef } from 'react';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { BtnType, Button } from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '../components/form/InputField';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoiceNote>;
  navigation: NativeStackNavigationProp<MainStackParamList, MainStackRouteNames.AddInvoiceNote>;
};

const initialValues = {
  note: '',
};

const validationSchema = Yup.object().shape({
  note: Yup.string(),
});

export const AddInvoiceNote: React.FC<Props> = ({ route, navigation }) => {
  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }
  }, [route]);

  const onSave = (values: any) => {
    if (route.params.callback) {
      route.params.callback({
        [returnValueName.current!]: values.note,
      });
      navigation.goBack();
      return;
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title={'Add Invoice Note'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={
            route.params?.value?.length ? { note: route.params?.value } : initialValues
          }
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={onSave}
        >
          {({ isValid, value, handleSubmit }) => (
            <>
              <ScrollView style={styles.container}>
                <View style={styles.field}>
                  <InputField
                    label={'Note (optional)'}
                    name={'note'}
                    containerStyle={styles.field}
                    inputStyle={{ minHeight: 150, textAlignVertical: 'top' }}
                    textInputProps={{
                      multiline: true,
                    }}
                  />
                </View>
              </ScrollView>
              <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
                <Button
                  text={'Save'}
                  containerStyle={styles.action}
                  onPress={handleSubmit}
                  disabled={!isValid}
                />
                <Button
                  text={'Cancel'}
                  type={BtnType.Outlined}
                  containerStyle={styles.action}
                  onPress={onCancel}
                />
              </View>
            </>
          )}
        </Formik>
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
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  itemsRowInput: {
    flex: 1,
    marginHorizontal: 0,
  },
  itemsCard: {
    marginHorizontal: 0,
    marginRight: 8,
  },
  customLabel: {
    paddingHorizontal: 0,
  },
  field: {
    marginBottom: 16,
  },
});
