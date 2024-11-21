import React, {useEffect, useRef} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {SettingsStackRouteNames} from '../navigation/router-names';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {Button} from '../components/Button';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {InputField} from '../components/form/InputField';
import {SettingRouterParamList} from '../navigation/SettingsStackNavigator';

type Props = {
  route: RouteProp<SettingRouterParamList, SettingsStackRouteNames.AddTax>;
  navigation: NativeStackNavigationProp<
    SettingRouterParamList,
    SettingsStackRouteNames.AddTax
  >;
};

const initialValues = {
  rate: '',
  cost: '',
};

const validationSchema = Yup.object().shape({
  rate: Yup.string(),
  cost: Yup.string(),
});

export const AddTax: React.FC<Props> = ({route, navigation}) => {
  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }
  }, [route]);

  const onSave = (values: any): void => {
    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: values,
    });
  };

  return (
    <View style={styles.container}>
      <Header title={'Set tax'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={route.params?.value || initialValues}
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={onSave}>
          {({isValid, handleSubmit}) => (
            <>
              <ScrollView style={styles.container}>
                <InputField
                  label={'Tax'}
                  name={'rate'}
                  containerStyle={styles.field}
                />
                <InputField name={'cost'} containerStyle={styles.field} />
                <View style={[styles.actions, {paddingBottom: 26}]}>
                  <Button
                    text={'Save'}
                    containerStyle={styles.action}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  />
                </View>
              </ScrollView>
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
  field: {
    marginBottom: 16,
  },
});
