import React, {useRef} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {SearchIcon} from './icons/SearchIcon';
import {colors} from '../styles/colors';

type Props = {
  onSearch?: (val: string) => void;
};

export const SearchInput: React.FC<Props> = ({onSearch}) => {
  const searchedValue = useRef('');

  const handleSearch = (val: string) => {
    searchedValue.current = val;
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <SearchIcon size={18} color={colors.gray} />
        <TextInput
          onChangeText={handleSearch}
          style={styles.input}
          placeholder={'Search...'}
          placeholderTextColor={colors.gray}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 24,
    marginVertical: 10,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 6,
    // ...font(14, 16, '500'),
    color: colors.text.grayText,
  },
  searchBtn: {
    marginLeft: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
