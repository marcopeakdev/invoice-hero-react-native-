import React from 'react';
import { StyleSheet, View, ViewStyle, Text, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { Checkbox } from './Checkbox';
import { TrashIcon } from './icons/TrashIcon';

export enum RightComponentType {
  Checkbox = 'Checkbox',
  Quantity = 'Quantity',
}

type Props = {
  titleContainerStyle?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  titleStyle?: ViewStyle | ViewStyle[] | undefined;
  title?: string;
  subTitle?: string;
  value?: number;
  containerStyle?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  onChangeValue?: (val: number) => void;
  onRemoveItem?: () => void;
  type?: RightComponentType;
  checked?: boolean | false;
  onCheck?: (val: boolean) => void;
  onClickEdit?: () => void;
};

export const CustomExpenseItem: React.FC<Props> = ({
  containerStyle,
  titleContainerStyle,
  contentContainerStyle,
  titleStyle,
  title,
  subTitle,
  type = RightComponentType.Checkbox,
  value,
  onChangeValue,
  onRemoveItem,
  onCheck,
  checked = false,
  onClickEdit,
}) => {
  let additionalStyles: ViewStyle[] = [];
  if (containerStyle) {
    if (Array.isArray(containerStyle)) {
      additionalStyles = [...containerStyle];
    } else {
      additionalStyles = [containerStyle];
    }
  }

  const handleEdit = () => {
    onClickEdit && onClickEdit();
  };

  return (
    <View style={[styles.container, ...additionalStyles]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {type === RightComponentType.Checkbox && (
          <Checkbox checked={checked} onChange={(status) => onCheck && onCheck(status)} />
        )}
        <TouchableOpacity onPress={handleEdit}>
          <View style={[styles.titleContainer, titleContainerStyle]}>
            <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
            {subTitle && (
              <Text style={[styles.subTitleStyle, titleStyle]}>{subTitle}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {type === RightComponentType.Checkbox && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => onRemoveItem && onRemoveItem()}>
              <TrashIcon color={'#6B7280'} size={20} />
            </TouchableOpacity>
          </View>
        )}
        {type === RightComponentType.Quantity && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.rightRow}>
              <TouchableOpacity style={styles.quantityBtn} onPress={() => onChangeValue && onChangeValue(-1)}>
                <Text style={styles.quantityBtnLabel}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{value}</Text>
              <TouchableOpacity style={styles.quantityBtn} onPress={() => onChangeValue && onChangeValue(1)}>
                <Text style={styles.quantityBtnLabel}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => onRemoveItem && onRemoveItem()}>
              <TrashIcon color={'#6B7280'} size={16} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    shadowColor: 'rgba(6, 16, 45)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  titleContainer: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  contentContainer: {
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    color: colors.gray,
    fontSize: 14,
  },
  subTitleStyle: {
    color: colors.lightGray,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  quantityBtn: {
    borderRadius: 200,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    width: 22.5,
    height: 22.5,
    marginHorizontal: 8,
  },
  quantityBtnLabel: {
    ...font(22.5, 21, '300'),
    lineHeight: 28,
    color: 'black',
  },
  quantityValue: {
    ...font(14, 21, '300'),
    lineHeight: 30,
    color: 'black',
  }
});
