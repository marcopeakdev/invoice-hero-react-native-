import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import ToggleSwitch from 'toggle-switch-react-native';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { InvoiceBalanceOverview } from '../components/InvoiceBalanceOverview';
import { ArrowDownIcon } from '../components/icons/ArrowDown';
import { colors } from '../styles/colors';
import { InvoiceCategoriesOverview } from '../components/InvoiceCategoriesOverview';
import { InvoiceClientsOverview } from '../components/InvoiceClientsOverview';
import { InvoiceChart } from '../components/InvoiceChart';
import { SearchIcon } from '../components/icons/SearchIcon';
import { FilterIcon } from '../components/icons/FilterIcon';
import { BellIcon } from '../components/icons/BellIcon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStackNavigator';
import { MainStackRouteNames } from '../navigation/router-names';
import { commonView } from '../styles/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveBlocks } from '../store/selectors/dashboard';
import { setActiveBlocks, toggleBlock } from '../store/reducers/dashboard';
import { InvoiceStatus } from '../models/invoice';
import { font } from '../styles/font';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export const Home: React.FC<Props> = ({ navigation }) => {
  const activeDashboard = useSelector(selectActiveBlocks);
  const dispatch = useDispatch<any>();
  const insets = useSafeAreaInsets();

  const [showFilterDropDown, setShowFilterDropDown] = useState(false);

  // const [activeSections, setActiveSections] = useState<number[]>([0]);
  const [clients] = useState([]);
  const [categories] = useState([]);

  const sections = useMemo(() => {
    return [
      {
        title: 'Chart Overview',
        content: <InvoiceChart />,
      },
      {
        title: 'Balance Overview',
        content: (
          <InvoiceBalanceOverview
            statuses={[InvoiceStatus.Paid, InvoiceStatus.Unpaid, InvoiceStatus.PartiallyPaid, InvoiceStatus.Estimate]}
          />
        ),
      },
      {
        title: 'Clients Overview',
        content: (
          <InvoiceClientsOverview
            statuses={[InvoiceStatus.Paid, InvoiceStatus.Unpaid]}
            clients={clients}
            isHomeScreen={true}
          />
        ),
      },
      {
        title: 'Categories Overview',
        content: (
          <InvoiceCategoriesOverview
            statuses={[InvoiceStatus.Paid, InvoiceStatus.Unpaid]}
            categories={categories}
            isHomeScreen={true}
          />
        ),
      },
    ];
  }, [clients, categories]);

  const onChange = (indexes: number[]) => {
    dispatch(setActiveBlocks(indexes));
  };

  const activeBlocks = useMemo(() => {
    const result: number[] = [];
    activeDashboard.forEach((item, itemI) => {
      if (item.show) {
        result.push(itemI);
      }
    });

    return result;
  }, [activeDashboard]);

  const renderHeader = (section: any, index: number) => {
    return (
      <View
        style={[
          styles.section,
          !activeBlocks.includes(index) && styles.sectionNotActive,
        ]}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View
          style={[
            styles.sectionIcon,
            !activeBlocks.includes(index) && styles.sectionIconActive,
          ]}>
          <ArrowDownIcon color={colors.gray} />
        </View>
      </View>
    );
  };

  const renderContent = useCallback((section: any) => {
    return <View style={styles.sectionContent}>{section.content}</View>;
  }, []);

  const rightHeader = (
    <View style={styles.headerIconsContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate(MainStackRouteNames.SearchPopup)}
        activeOpacity={0.7}
        style={styles.headerIcon}>
        <SearchIcon size={16} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(MainStackRouteNames.Notifications)}
        activeOpacity={0.7}
        style={styles.headerIcon}>
        <BellIcon size={16} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowFilterDropDown(true)}
        activeOpacity={0.7}
        style={styles.headerIcon}>
        <FilterIcon size={16} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {showFilterDropDown && (
        <>
          <TouchableWithoutFeedback
            onPress={() => setShowFilterDropDown(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.filterDropDownContainer,
              commonView.commonShadow,
              {
                top: 60 + insets.top,
              },
            ]}>
            {activeDashboard.map((item, index) => {
              return (
                <View
                  key={`dashboard_filter_${index}`}
                  style={[
                    styles.dropDownListItem,
                    activeDashboard.length === index + 1 &&
                    styles.dropDownListItemWithoutBorder,
                  ]}>
                  <Text style={styles.dropDownListItemText}>{item.label}</Text>
                  <ToggleSwitch
                    size={'small'}
                    isOn={item.show}
                    onToggle={() => dispatch(toggleBlock(index))}
                    trackOnStyle={{
                      backgroundColor: '#5799F8',
                    }}
                  />
                </View>
              );
            })}
          </View>
        </>
      )}
      <Header title={'Home'} rightSideComponent={rightHeader} />
      <PageContainer>
        <ScrollView style={styles.content}>
          <Accordion
            activeSections={activeBlocks}
            sections={sections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={onChange}
            underlayColor={'transparent'}
            expandMultiple={true}
          />
        </ScrollView>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  sectionNotActive: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  sectionIcon: {},
  sectionIconActive: {
    transform: [{ rotate: '180deg' }],
  },
  sectionTitle: {
    color: colors.text.grayText,
    ...font(16, 24),
    fontWeight: '400',
  },
  sectionContent: {
    paddingTop: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  filterDropDownContainer: {
    position: 'absolute',
    right: 24,
    backgroundColor: colors.whiteColor,
    zIndex: 30,
    borderRadius: 8,
  },
  dropDownListItem: {
    paddingHorizontal: 16,
    minWidth: 100,
    height: 40,
    justifyContent: 'space-between',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownListItemWithoutBorder: {
    borderBottomWidth: 0,
  },
  dropDownListItemText: {
    color: colors.text.darkGrayText,
    ...font(14, 16),
    marginRight: 15,
  },
});
