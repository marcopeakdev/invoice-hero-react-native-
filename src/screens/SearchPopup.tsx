import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useDebouncedCallback } from 'use-debounce';
import { font } from '../styles/font';
import { colors, gradients } from '../styles/colors';
import { Overlay } from '../components/Overlay';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { FilterIcon } from '../components/icons/FilterIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectClientsByName, selectFilter } from '../store/selectors/clients';
import { searchByClientName } from '../store/thunk/clients';
import { MainStackRouteNames } from '../navigation/router-names';
import { Card } from '../components/Card';
import { currencyFormatter } from '../utils/currency';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { Client, ClientSearchByNameRequest } from '../models/client';
import { SearchFilter } from '../components/SearchFilter';
import { clearSearchByClientName } from '../store/reducers/clients';
import { BSON } from 'realm';

const height = Dimensions.get('screen').height;

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export const SearchPopup: React.FC<Props> = ({ navigation }) => {
  const [showFilter, setShowFilter] = useState(false);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch<any>();
  const clientByName = useSelector(selectClientsByName);
  const [value, setValue] = useState('');

  const insets = useSafeAreaInsets();
  const animatedProgress = useSharedValue(-1);

  useEffect(() => {
    animatedProgress.value = withSpring(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    top: interpolate(
      animatedProgress.value,
      [-1, 0],
      [-height, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const appliedFilterAmount = useMemo(() => {
    let counter = 0;

    if (filter.categories.length) {
      counter += 1;
    }

    if (filter.start || filter.end) {
      counter += 1;
    }

    if (filter.min || filter.max) {
      counter += 1;
    }

    return counter;
  }, [filter]);

  const onChange = useDebouncedCallback(v => {
    setValue(v);
  }, 400);

  useEffect(() => {
    let request: Partial<ClientSearchByNameRequest> = {};

    if (filter.categories?.length) {
      request.categories = filter.categories;
    }

    if (filter.end) {
      request.end = filter.end;
    }

    if (filter.start) {
      request.start = filter.start;
    }

    if (filter.min) {
      request.min = Number(filter.min);
    }

    if (filter.max) {
      request.max = Number(filter.max);
    }

    if (value.length) {
      dispatch(
        searchByClientName({
          name: value,
          ...request,
        }),
      );
    } else {
      dispatch(clearSearchByClientName())
    }
  }, [filter, value]);

  const goBack = () => {
    navigation.goBack();
  };

  const onClose = () => {
    animatedProgress.value = withTiming(
      -1,
      {
        duration: 400,
      },
      canceled => {
        runOnJS(goBack)();
      },
    );
  };

  const renderItem: ListRenderItem<Client & { sum: number }> = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.replace(MainStackRouteNames.InvoiceSearchByClient, {
            title: item.name,
            request: {
              clients: [new BSON.ObjectID(item._id)]
            },
          })
        }>
        <Card containerStyle={styles.card}>
          <Text style={styles.clientName}>{item.name || 'None'}</Text>
          <Text style={styles.clientSum}>
            {currencyFormatter.format(item.sum || 0)}
          </Text>
          <View style={styles.icon}>
            <ArrowLeftIcon color={'#D1D5DB'} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const content = useCallback(() => {
    if (showFilter) {
      return <SearchFilter closeFilter={() => setShowFilter(false)} />;
    }

    if (clientByName.loading) {
      return <ActivityIndicator />;
    }


    if (!clientByName.result.length) {
      return <Text style={styles.placeholderResult}>Empty result</Text>;
    }

    return <FlatList data={clientByName.result} renderItem={renderItem} />;
  }, [clientByName, value, showFilter]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <Overlay animatedProgress={animatedProgress} />
      </Pressable>
      <Animated.View style={[styles.innerContainer, animatedStyle]}>
        <LinearGradient
          {...gradients.mainBlueGradient}
          style={[styles.topContainer, { paddingTop: insets.top + 16 }]}>
          <TextInput
            style={styles.searchInput}
            onChangeText={onChange}
            placeholderTextColor={colors.text.whiteTextOpacity[80]}
            placeholder={'Search...'}
          />
          <TouchableOpacity
            onPress={() => setShowFilter(state => !state)}
            activeOpacity={0.7}
            style={styles.filterContainer}>
            <FilterIcon size={16} />
            {Boolean(appliedFilterAmount) && (
              <View style={styles.counter}>
                <Text style={styles.counterText}>{appliedFilterAmount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.contentContainer}>{content()}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    // flex: 1,
    maxHeight: '80%',
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: colors.screenBackground,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  topContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
    // ...font(14, 15),
    color: colors.text.whiteText,
  },
  filterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 8,
  },
  cancelButton: {
    ...font(14, 16),
    color: colors.text.whiteText,
    top: 1,
    marginLeft: 8,
  },
  placeholderResult: {
    textAlign: 'center',
    ...font(14, 15),
    color: colors.text.grayText,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  clientName: {
    ...font(14, 16, '500'),
    color: colors.text.darkGrayText,
    flex: 1,
  },
  clientSum: {
    ...font(16, 18, '500'),
    color: colors.text.black,
  },
  icon: {
    marginLeft: 24,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  counter: {
    zIndex: 1,
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#3f51b5',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
  },
});
