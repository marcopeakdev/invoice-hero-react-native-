import React, {useRef} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {SearchIcon} from './icons/SearchIcon';
import {colors} from '../styles/colors';

type Props = {
  onSearch?: (val: string) => void;
};

export const HeaderSearch: React.FC<Props> = ({onSearch}) => {
  const searchedValue = useRef('');

  const pressSearch = () => {
    if (onSearch) {
      onSearch(searchedValue.current);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <SearchIcon size={18} />
        <TextInput
          onChangeText={val => (searchedValue.current = val)}
          style={styles.input}
          placeholder={'Search...'}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
        />
      </View>
      <TouchableOpacity
        onPress={pressSearch}
        activeOpacity={0.7}
        style={styles.searchBtn}>
        <SearchIcon size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 6,
    // ...font(14, 16, '500'),
    color: colors.text.whiteText,
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
