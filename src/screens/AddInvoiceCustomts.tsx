import React, {useEffect, useRef} from 'react';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FieldArray, Formik} from 'formik';
import * as Yup from 'yup';
import {BtnType, Button} from '../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {InputField} from '../components/form/InputField';
import {TrashIcon} from '../components/icons/TrashIcon';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoiceCustoms>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddInvoiceCustoms
  >;
};

const initialValues = {
  customs: [
    {
      name: '',
      description: '',
    },
  ],
};

const validationSchema = Yup.object().shape({
  customs: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string().required(),
      }),
    )
    .required('Required'),
});

export const AddInvoiceCustoms: React.FC<Props> = ({route, navigation}) => {
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
        [returnValueName.current!]: values.customs,
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
      <Header title={'Add Custom Fields'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={
            route.params?.value?.length
              ? {customs: route.params?.value}
              : initialValues
          }
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={onSave}>
          {({isValid, values, errors, handleSubmit}) => (
            <>
              <ScrollView style={styles.container}>
                <FieldArray name={'customs'}>
                  {({remove, push}) => {
                    return (
                      <>
                        <View style={styles.field}>
                          {values.customs.map((item: any, index: number) => {
                            return (
                              <View key={index}>
                                <View style={styles.itemsRow}>
                                  <InputField
                                    label={'Name'}
                                    name={`customs.${index}.name`}
                                    placeholder={'Name'}
                                    containerStyle={styles.itemsRowInput}
                                    cardStyle={styles.itemsCard}
                                    labelStyle={styles.customLabel}
                                  />
                                  <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                      if (values.customs.length > 1) {
                                        remove(index);
                                      }
                                    }}>
                                    <TrashIcon
                                      color={
                                        values.customs.length > 1
                                          ? '#6B7280'
                                          : '#dedede'
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>
                                <InputField
                                  label={'Description'}
                                  name={`customs.${index}.description`}
                                  placeholder={'Description'}
                                />
                              </View>
                            );
                          })}
                        </View>
                        <View style={[styles.actions]}>
                          <Button
                            text={'Add new field'}
                            type={BtnType.Outlined}
                            onPress={() =>
                              push({
                                name: '',
                                description: '',
                              })
                            }
                          />
                        </View>
                      </>
                    );
                  }}
                </FieldArray>
              </ScrollView>
              <View
                style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
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
