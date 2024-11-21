import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { colors } from '../styles/colors';
import { InvoicesCorner } from '../components/icons/InvoicesCorner';
import { InvoiceBalanceOverview } from '../components/InvoiceBalanceOverview';
import { constants } from '../utils/constants';
import { Card } from '../components/Card';
import { ArrowDownIcon } from '../components/icons/ArrowDown';
import { InvoiceClientsOverview } from '../components/InvoiceClientsOverview';
import { useDispatch, useSelector } from 'react-redux';
import { HorizontalButtonsList } from '../components/HorizontalButtonsList';
import { InvoiceCategoriesOverview } from '../components/InvoiceCategoriesOverview';
import { HeaderDateSelect } from '../components/HeaderDateSelect';
import { InvoiceDateOverview } from '../components/InvoiceDateOverview';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { InvoicesStackRouteNames, MainBottomTabsRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainBottomTabsParamList } from '../navigation/MainBottomTabs';
import { InvoiceStatus } from '../models/invoice';
import { font } from '../styles/font';
import { InvoiceOverview } from '../components/InvoiceOverview';
import { loadListInvoice } from '../store/thunk/invoices';
import { HeaderSearchAnimated } from '../components/HeaderSearchAnimated';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';
import { selectUser } from '../store/selectors/user';

const { useQuery } = RealmContext;

const tabs = ['All', 'Date', 'Categories', 'Clients'];

type Props = {
  route: RouteProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Estimate | InvoicesStackRouteNames.InvoicesMain
  >;
  navigation: NativeStackNavigationProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Estimate | InvoicesStackRouteNames.InvoicesMain
  >;
};

export const Invoices: React.FC<Props> = ({ route }) => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();


  const [showTabsList, setShowTabsList] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedClients, setSelectedClients] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [periodOfTime, setPeriodOfTime] = useState<any[] | null>(null);

  const user = useSelector(selectUser);

  const clients = useQuery('clients').filtered('user == $0 && status == "Active"', new BSON.ObjectID(user?._id))
  const categories = useQuery('categories').filtered('user == $0 && status == "Active"', new BSON.ObjectID(user?._id))

  const changeActiveTab = (tab: string) => {
    setShowTabsList(state => !state);
    setActiveTab(tab);

    setSelectedClients([]);
    setSelectedCategories([]);
    setPeriodOfTime(null);
  };

  const searchedClientIds = useMemo(() => {
    let clientFiltered: any[] = []
    if (searchTerm) {
      clientFiltered = clients.toJSON().filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return clientFiltered.map(item => item._id)
  }, [clients, searchTerm])

  const isEstimate = useMemo(() => {
    return route.params?.estimates
  }, [route])

  const getHeaderContent = useMemo(() => {
    switch (activeTab) {
      case 'Date': {
        return (
          <HeaderDateSelect onDateChange={date => setPeriodOfTime(date)} />
        );
      }
      case 'Clients': {
        const formattedClients = clients.map((client: any) => {
          return { label: client.name, value: client._id.toString() };
        });
        return (
          <HorizontalButtonsList
            data={formattedClients}
            onSelectedItemChange={result => {
              let clientData = result.map(item => clients.find((_item:any) => _item?._id.toString() === item))
              setSelectedClients(clientData)
            }}
          />
        );
      }
      case 'Categories': {
        const formattedCategories = categories.map((category: any) => {
          return { label: category.name, value: category._id.toString() };
        });

        return (
          <HorizontalButtonsList
            data={formattedCategories}
            onSelectedItemChange={result => {
              let categoryData = result.map(item => categories.find((_item:any) => _item?._id.toString() === item))
              setSelectedCategories(categoryData)}
            }
          />
        );
      }
      default:
        return null;
    }
  }, [activeTab, clients, categories]);

  const callback = () => {
    if (!isEstimate && activeTab === 'All') {
      dispatch(
        loadListInvoice({
          statuses: [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
          page: 1,
        }),
      );
    }
  }

  const getPageContent = useMemo(() => {
    switch (activeTab) {
      case 'All':
        return (
          <View style={{ display: 'flex', flex: 1 }}>
            <InvoiceBalanceOverview
              isHorizontal={true}
              callback={callback}
              statuses={
                route.params?.estimates
                  ? [InvoiceStatus.Estimate]
                  : [InvoiceStatus.Unpaid, InvoiceStatus.Paid, InvoiceStatus.PartiallyPaid]
              }
            />
            <InvoiceOverview
              isEstimate={isEstimate}
              searchTerm={searchTerm}
              clients={searchedClientIds}
            />
          </View>
        );
      case 'Clients':
        return (
          <InvoiceClientsOverview
            statuses={
              route.params?.estimates
                ? [InvoiceStatus.Estimate]
                : [InvoiceStatus.Unpaid, InvoiceStatus.Paid]
            }
            clients={selectedClients}
          />
        );
      case 'Categories':
        return (
          <InvoiceCategoriesOverview
            statuses={
              route.params?.estimates
                ? [InvoiceStatus.Estimate]
                : [InvoiceStatus.Unpaid, InvoiceStatus.Paid]
            }
            categories={selectedCategories}
          />
        );
      case 'Date':
        return (
          <InvoiceDateOverview
            statuses={
              route.params?.estimates
                ? [InvoiceStatus.Estimate]
                : [InvoiceStatus.Unpaid, InvoiceStatus.Paid]
            }
            date={periodOfTime}
            searchTerm={searchTerm}
            clients={searchedClientIds}
          />
        );
      default:
        return null;
    }
  }, [activeTab, selectedClients, selectedCategories, periodOfTime, isEstimate, searchTerm]);

  const rightComponent = useMemo(() => {
    return activeTab === 'All' || activeTab === 'Date' ? (
      <HeaderSearchAnimated
        onSearch={searchValue => {
          setSearchTerm(searchValue)
        }}
      />
    ) : null
  }, [activeTab])

  useEffect(() => {
    if (route.params?.defaultTab) {
      setActiveTab(route.params?.defaultTab)
    }
  }, [route.params])

  return (
    <View style={styles.container}>
      <Header
        title={isEstimate ? 'Estimates' : 'Invoices'}
        rightSideComponent={rightComponent}
        showBackBtn={true}
        onBackPress={() => {
          navigation.jumpTo(MainBottomTabsRouteNames.Home)
        }}
        >
        {getHeaderContent}
        <View style={styles.reviewContainer}>
          <View style={styles.reviewBlockTitle}>
            <Text style={styles.reviewByText}>Review by</Text>
          </View>
          <View style={styles.displayBlock}>
            <View style={styles.corner}>
              <InvoicesCorner color={colors.screenBackground} />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.dropDownContainer}
              onPress={() => setShowTabsList(state => !state)}>
              <Text style={styles.displayBlockText}>{activeTab}</Text>
              <View style={showTabsList && styles.iconOpened}>
                <ArrowDownIcon />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Header>
      <PageContainer roundLeftTopBorder={false}>
        {showTabsList && (
          <Card containerStyle={styles.dropDownList}>
            {tabs.map(tab => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={`elem_${tab}`}
                  onPress={() => {
                    changeActiveTab(tab)
                  }}
                  style={styles.dropDownListItem}>
                  <Text style={styles.dropDownListItemText}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </Card>
        )}
        {activeTab === 'All' ? (
          getPageContent
        ) : (
          <ScrollView style={styles.content} keyboardShouldPersistTaps="never">{getPageContent}</ScrollView>
        )}
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewContainer: {
    height: 50,
    flexDirection: 'row',
    zIndex: 10,
    bottom: -5,
  },
  reviewBlockTitle: {
    backgroundColor: colors.screenBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    paddingLeft: 24,
    flex: 3,
  },
  reviewByText: {
    ...font(16, 18, '500'),
    color: colors.text.blue,
  },
  displayBlock: {
    flex: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
  },
  displayBlockText: {
    ...font(16, 18, '500'),
    color: colors.text.whiteText,
    marginRight: 8,
  },
  iconOpened: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  corner: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    width: 17,
    height: 16,
  },
  content: {
    flex: 1,
  },
  dropDownContainer: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownList: {
    position: 'absolute',
    top: -constants.pageContainerBorderHeight - 10,
    zIndex: 1,
    right: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dropDownListItem: {
    paddingHorizontal: 16,
    minWidth: 100,
    height: 40,
    justifyContent: 'center',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  dropDownListItemText: {
    color: colors.text.darkGrayText,
    ...font(14, 16),
  },
  headerIconsContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    display: 'flex'
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    // marginLeft: 16,
    right: 0
  },
  inputContainer: {
    // flex: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    // width: SCREEN_WIDTH / 2
    width: 32
  },
  input: {
    flex: 1,
    marginLeft: 16,
    marginRight: 32,
    // ...font(14, 16, '500'),
    color: colors.text.whiteText,
  },
});
