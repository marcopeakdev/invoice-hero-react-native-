import React, { useCallback, useState } from 'react';
import { FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { font } from '../styles/font';

type Props = {
  data: { label: string; value: any }[];
  onSelectedItemChange?: (result: any[]) => void;
};

export const HorizontalButtonsList: React.FC<Props> = ({
  data,
  onSelectedItemChange,
}) => {
  const [selectedItems, setSelectedItems] = useState(new Map());

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setSelectedItems(state => {
              if (state.has(item.value)) {
                state.delete(item.value);
              } else {
                state.set(item.value, true);
              }

              if (onSelectedItemChange) {
                onSelectedItemChange([...state.keys()]);
              }

              return new Map(state);
            })
          }
          style={[
            styles.item,
            selectedItems.has(item.value) && styles.itemActive,
          ]}>
          <Text
            style={[
              styles.itemText,
              selectedItems.has(item.value) && styles.itemTextActive,
            ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [onSelectedItemChange, selectedItems],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.value}
      renderItem={renderItem}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    marginBottom: 20,
  },
  item: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.whiteColor,
    borderRadius: 38,
    paddingHorizontal: 18,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: colors.whiteColor,
  },
  itemText: {
    ...font(14, 16, '500'),
    color: colors.text.whiteText,
  },
  itemTextActive: {
    color: colors.text.grayText,
  },
});
