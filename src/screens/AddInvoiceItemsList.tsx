import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { Button } from '../components/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SearchInput } from '../components/SearchInput';
import { PlusIcon } from '../components/icons/PlusIcon';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { CustomInvoiceItem } from '../components/CustomInvoiceItem';
import RealmContext from '../database/RealmContext';
import { Invoice } from '../models/invoice';

const { useRealm, useObject } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoiceItemsList>;
  navigation: NativeStackNavigationProp<MainStackParamList, MainStackRouteNames.AddInvoiceItemsList>;
};

export const AddInvoiceItemsList: React.FC<Props> = ({ route, navigation }) => {
  const returnValueName = useRef<string | null>(null);
  const [search, setSearchText] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isDifferent, setDifferent] = useState(false);

  const realm = useRealm();
  const formatedInvoice = useObject<Invoice>('invoices', route.params?.invoiceId);
  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }
  }, [route]);
  const [allItems, setAllItems] = useState(formatedInvoice?.items || []);
  const handleCreateItem = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceSingleItem, {
      items: formatedInvoice?.items,
      invoiceId: route.params?.invoiceId,
      itemIndex: -1,
    });
  };

  const itemList = useMemo(() => {
    return formatedInvoice?.items || [];
  }, [formatedInvoice]);

  const handleSearch = (val: string) => {
    setSearchText(val);
    let tempItems = formatedInvoice?.items || [];
    if (search) {
      tempItems = formatedInvoice?.items?.filter((item: any) => item.description.toLowerCase().indexOf(search.toLowerCase()) > -1) || [];
    }
    setAllItems([...tempItems]);
  };

  const handleCheck = (status: boolean, index: number) => {
    let temp_items: any = Object.assign([], allItems);
    if (temp_items && temp_items[index]) {
      temp_items[index] = {
        description: temp_items[index].description,
        hours: temp_items[index].hours,
        rate: temp_items[index].rate,
        selected: status,
        isDefault: temp_items[index].isDefault,
      };
    }
    const tempItems = [...temp_items];
    setAllItems([...tempItems]);
    setDifferent(true);
  };

  const calculateSubTotal = (list: any) => {
    const d = list.reduce((a: number, c: any) => {
      let result = 0;

      if (c.rate && c.hours) {
        result = Number(c.rate) * Number(c.hours);
      }

      return a + result;
    }, 0);
    return d;
  }

  const handleRemoveItem = (index: number) => {
    const items = route.params?.value?.items || [];
    items.splice(index, 1);
    setAllItems([...items]);

    if (route.params?.invoiceId) {
      const _invoiceItem: any = realm.objectForPrimaryKey<Invoice>('invoices', route.params?.invoiceId);
      const subtotal = calculateSubTotal(items);
      const deposit = route.params?.value?.deposit;
      if (_invoiceItem) {
        realm.write(() => {
          _invoiceItem['items'] = [...items.map((item: any) => ({ description: item.description, hours: Number(item.hours), rate: Number(item.rate), selected: item.selected, isDefault: item.isDefault }))];
          _invoiceItem['subTotal'] = subtotal;
          _invoiceItem['discount'] = Math.round(((subtotal * Number(route.params?.value?.discountRate)) / 100) * 100) / 100;
          _invoiceItem['tax'] = Math.round((((subtotal - _invoiceItem['discount']) * Number(route.params?.value?.taxRate)) / 100) * 100) / 100;
          _invoiceItem['total'] = subtotal - (_invoiceItem['discount'] ? Number(_invoiceItem['discount']) : 0) + (_invoiceItem['tax'] ? Number(_invoiceItem['tax']) : 0) - (deposit ? Number(deposit) : 0);
        });
      }
    }
  };

  const handleRemove = (index: number) => {
    Alert.alert('Are you sure?', 'This will permanently delete the item from the list.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Confirm ', onPress: () => handleRemoveItem(index) },
    ]);
  }

  const handleSubmit = () => {
    setLoading(true);
    const _invoiceItem: any = realm.objectForPrimaryKey<Invoice>('invoices', route.params?.invoiceId);
    realm.write(() => {
      _invoiceItem['items'] = allItems.map((item: any) => ({
        description: item.description || '',
        rate: Number(item.rate),
        hours: Number(item.hours),
        selected: item.selected || false,
        isDefault: item.isDefault || false,
      }));
    });
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 100);
  }

  const handleClickEdit = (index: number) => {
    navigation.navigate(MainStackRouteNames.AddInvoiceSingleItem, {
      invoiceId: route?.params?.invoiceId,
      items: allItems,
      itemIndex: index,
    });
  };
  console.log(itemList);
  return (
    <View style={styles.container}>
      <Header title={'Add Items'} showBackBtn={true} />
      <PageContainer>
        <SearchInput onSearch={handleSearch} />
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.labelStyle}>Item List</Text>
          <View>
            {/** Items List */}
            {itemList.map((item: any, key: number) => (
              <CustomInvoiceItem
                title={item.description}
                subTitle={'$' + Number(item.rate).toFixed(2)}
                key={'custom_invoice_' + key}
                checked={item.selected}
                onCheck={(val: boolean) => handleCheck(val, key)}
                onClickEdit={() => handleClickEdit(key)}
                onRemoveItem={() => handleRemove(key)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleCreateItem} style={{ marginHorizontal: 5, marginBottom: 40, }}>
            <View style={[styles.cardRowBorderValue, styles.cardRowButton, { borderRadius: 5, backgroundColor: 'rgba(45, 122, 234, 0.1)', paddingHorizontal: 18, paddingVertical: 13 }]}>
              <Text style={{ color: colors.bluePrimary }}>Create New Item</Text>
              <View style={{ marginRight: 10 }}>
                <PlusIcon size={16} color={colors.bluePrimary} />
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          <Button
            text={'Save'}
            containerStyle={styles.action}
            onPress={handleSubmit}
            disabled={!isDifferent || isLoading}
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
  scrollContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingBottom: 40,
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
  cardRowBorderValue: {
    flex: 1,
    ...font(14, 21, '300'),
    color: colors.text.darkGrayText,
    borderBottomColor: colors.text.grayText,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  cardRowButton: {
    borderBottomWidth: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5
  },
  labelStyle: {
    fontSize: 16,
    lineHeight: 21,
    marginHorizontal: 5,
    marginVertical: 8,
    fontWeight: '500',
    color: colors.gray,
  }
});
