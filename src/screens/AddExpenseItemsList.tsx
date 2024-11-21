import React, { useEffect, useRef, useMemo, useState } from 'react';
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
import RealmContext from '../database/RealmContext';
import { Expense } from '../models/expense';
import { CustomExpenseItem } from '../components/CustomExpenseItem';

const { useRealm, useObject } = RealmContext;

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddExpenseItemsList>;
  navigation: NativeStackNavigationProp<MainStackParamList, MainStackRouteNames.AddExpenseItemsList>;
};

export const AddExpenseItemsList: React.FC<Props> = ({ route, navigation }) => {
  const returnValueName = useRef<string | null>(null);
  const [search, setSearchText] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isDifferent, setDifferent] = useState(false);

  const realm = useRealm();
  const formatedExpense = useObject<Expense>('expenses', route.params?.expenseId);
  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }
  }, [route]);
  const [allItems, setAllItems] = useState(formatedExpense?.items || []);
  const handleCreateItem = () => {
    navigation.navigate(MainStackRouteNames.AddExpenseSingleItem, {
      items: formatedExpense?.items || [],
      expenseId: route.params?.expenseId,
      itemIndex: -1,
    });
  };

  const itemList = useMemo(() => {
    return formatedExpense?.items || [];
  }, [formatedExpense]);

  const handleSearch = (val: string) => {
    setSearchText(val);
    let tempItems = formatedExpense?.items || [];
    if (search) {
      tempItems = formatedExpense?.items?.filter((item: any) => item.description.toLowerCase().indexOf(search.toLowerCase()) > -1) || [];
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

    if (route.params?.expenseId) {
      const _expenseItem: any = realm.objectForPrimaryKey<Expense>('expenses', route.params?.expenseId);
      const subtotal = calculateSubTotal(items);
      if (_expenseItem) {
        realm.write(() => {
          _expenseItem['items'] = [...items.map((item: any) => ({ description: item.description, hours: Number(item.hours), rate: Number(item.rate), selected: item.selected, isDefault: item.isDefault }))];
          _expenseItem['subTotal'] = subtotal;
          _expenseItem['discount'] = Math.round(((subtotal * Number(route.params?.value?.discountRate)) / 100) * 100) / 100;
          _expenseItem['tax'] = Math.round((((subtotal - _expenseItem['discount']) * Number(route.params?.value?.taxRate)) / 100) * 100) / 100;
          _expenseItem['total'] = subtotal - (_expenseItem['discount'] ? Number(_expenseItem['discount']) : 0) + (_expenseItem['tax'] ? Number(_expenseItem['tax']) : 0);
        });_expenseItem
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
    const _expenseItem: any = realm.objectForPrimaryKey<Expense>('expenses', route.params?.expenseId);
    realm.write(() => {
      _expenseItem['items'] = allItems.map((item: any) => ({
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
    navigation.navigate(MainStackRouteNames.AddExpenseSingleItem, {
      expenseId: route?.params?.expenseId,
      items: allItems,
      itemIndex: index,
    });
  };
  
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
              <CustomExpenseItem
                title={item.description}
                subTitle={'$' + Number(item.rate).toFixed(2)}
                key={'custom_expense_' + key}
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
