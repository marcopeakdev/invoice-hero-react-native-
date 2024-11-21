import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SearchIcon } from './icons/SearchIcon';
import { colors } from '../styles/colors';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { CloseIcon } from './icons/CloseIcon';
import { useDebounce, useDebouncedCallback } from 'use-debounce';

type Props = {
  onSearch?: (val: string) => void;
};

export const HeaderSearchAnimated: React.FC<Props> =  ({ onSearch }) => {
  const searchInputRef = React.createRef<TextInput>();
  const [searchValue, setSearchValue] = useState('')
  const [isClose, setIsClose] = useState(true);

  const width = useSharedValue(42);

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(width.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  const requestClose = () => {
    if (!isClose) {
      width.value = 42
      searchInputRef?.current && searchInputRef.current.blur()
      setSearchValue('')
      setIsClose(true)
    }
  }

  const toggleAnimation = () => {

    if (isClose) {
      width.value = SCREEN_WIDTH / 2
      searchInputRef?.current && searchInputRef.current.focus()
      setIsClose(false)
    }
    else {
      width.value = 42
      searchInputRef?.current && searchInputRef.current.blur()
      setSearchValue('')
      setIsClose(true)
    }
  }

  const [debouncedSearchTerm] = useDebounce(searchValue, 500)

  useEffect(
    () => {
      onSearch && onSearch(debouncedSearchTerm)
    },
    [debouncedSearchTerm]
  );

  return (
    <View style={{ ...styles.headerIconsContainer }}>
      <Animated.View style={[styles.inputContainer,
        style
      ]}>
        <TextInput
          ref={searchInputRef}
          onChangeText={val => {
            setSearchValue(val)
          }}
          style={[styles.input, { opacity: isClose ? 0 : 1 }]}
          placeholder={'Search invoices...'}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchValue}
          cursorColor={'#fff'}
        />
        <TouchableOpacity
          onPress={toggleAnimation}
          activeOpacity={0.7}
          style={styles.headerIcon}>
          {isClose ? (<SearchIcon size={16} />) : (<CloseIcon size={16} />)}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerIconsContainer: {
    alignItems: 'center',
    display: 'flex'
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0
  },
  inputContainer: {
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 42
  },
  input: {
    flex: 1,
    marginLeft: 16,
    marginRight: 42,
    color: colors.text.whiteText,
  },
});
