import React, { useState } from 'react';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BtnType, Button } from '../components/Button';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { SelectedItemIcon } from '../components/icons/SelectedItemIcon';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { commonView } from '../styles/common';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { useSelector } from 'react-redux';
import { ActiveStatus } from '../models/common';
import { Client } from '../models/client';
import { EditIcon } from '../components/icons/EditIcon';
import RealmContext from '../database/RealmContext';
import { selectUser } from '../store/selectors/user';
import { BSON } from 'realm';

const { useQuery, useRealm } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.ClientDropDownList>;
  navigation: NativeStackNavigationProp<MainStackParamList, any>;
};

export const ClientDropDownList: React.FC<Props> = ({ route, navigation }) => {
  const user = useSelector(selectUser);

  const realm = useRealm();
  const clients = useQuery('clients').filtered('user == $0 && status == "Active"', new BSON.ObjectID(user?._id))

  const [selectedItem, setSelectedItem] = useState(
    route.params?.selectedValue || null,
  );
  const insets = useSafeAreaInsets();

  const onSave = () => {
    if (route.params.callback) {
      route.params.callback({ billTo: selectedItem })
      navigation.goBack()
    } else {
      navigation.navigate<any>(route.params.backScreen, {
        [route.params.returnValueName]: selectedItem,
      });
    }

  };

  const onCancel = () => {
    navigation.navigate<any>(route.params.backScreen);
  };

  const addNewClient = () => {
    navigation.navigate(MainStackRouteNames.ClientCreate, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'billTo',
      callback: (item) => {
        if (route.params.callback) {
          route.params.callback(item)
          navigation.goBack()
        } else {
          setSelectedItem(item.billTo)
        }
      }
    });
  };

  const editClient = (id: string) => {
    navigation.navigate(MainStackRouteNames.ClientCreate, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'billTo',
      clientId: id,
      callback: (item) => {
        setSelectedItem(item.billTo)
      }
    });
  };

  const deactivateClient = (client: any) => {
    if (realm) {
      const item = realm.objectForPrimaryKey<Client>('clients', client._id);
      if (item) {
        realm.write(() => {
          item.status = ActiveStatus.Inactive
        });
      }
      if (client._id.toString() === client._id.toString()) {
        setSelectedItem(null)
      }
    }
  };


  return (
    <View style={styles.container}>
      <Header title={route.params.title} showBackBtn={true} />
      <PageContainer>
        <ScrollView style={styles.container}>
          {clients.map((item: any, index) => {
            return (
              <Card
                key={`dropdown_item_${index}`}
                onPress={() => {
                  if (item._id.toString() === selectedItem?._id.toString()) {
                    setSelectedItem(null)
                  } else {
                    setSelectedItem(item)
                  }
                }}
                containerStyle={styles.selectContainer}>
                <View style={styles.listItem}>
                  <SelectedItemIcon selected={selectedItem && selectedItem._id.toString() === item._id.toString()} />
                  <Text style={styles.label}>{item.name}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{ paddingHorizontal: 7, marginRight: 8 }}
                    onPress={() => editClient(item._id)}
                  >
                    <EditIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{ paddingStart: 7, }}
                    onPress={() => deactivateClient(item)}
                  >
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
          <Card onPress={addNewClient} containerStyle={styles.field}>
            <View style={commonView.cardRow}>
              <Text style={commonView.cardRowValue}>Add new client</Text>
              <PlusIcon size={20} color={colors.gray} />
            </View>
          </Card>
        </ScrollView>
        <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            text={'Save'}
            containerStyle={styles.action}
            onPress={onSave}
          // disabled={selectedItem === null}
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
  selectContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    ...font(14, 16),
    color: colors.text.darkGrayText,
    marginLeft: 8
  },
  icon: {},
  field: {
    marginBottom: 16,
  },
});
