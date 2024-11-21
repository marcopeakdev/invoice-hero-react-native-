import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { BtnType, Button } from '../components/Button';
import { colors, gradients } from '../styles/colors';
import { constants, isIOS } from '../utils/constants';
import { useSelector } from 'react-redux';
import LinearGradientComponent from 'react-native-linear-gradient';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { ExpensesStackRouteNames, MainBottomTabsRouteNames, MainStackRouteNames } from '../navigation/router-names';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainBottomTabsParamList } from '../navigation/MainBottomTabs';
import { font } from '../styles/font';
import { HeaderSearchAnimated } from '../components/HeaderSearchAnimated';
import RealmContext from '../database/RealmContext';
import { BSON } from 'realm';
import { selectUser } from '../store/selectors/user';
import { ExpenseOverview } from '../components/ExpenseOverview';
import { ScanIcon } from '../components/icons/ScanIcon';
import ImagePicker from 'react-native-image-crop-picker';
import { getFileNameFromUri } from '../utils/files';
import { api, ApiRequestEnum } from '../utils/api';
import { PlusIcon } from '../components/icons/PlusIcon';

const { useQuery } = RealmContext;

const tabs = ['All', 'Date', 'Categories', 'Clients'];

type Props = {
  route: RouteProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Expenses | ExpensesStackRouteNames.ExpensesMain
  >;
  navigation: NativeStackNavigationProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Expenses | ExpensesStackRouteNames.ExpensesMain
  >;
};

export const Expenses: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchTerm, setSearchTerm] = useState('')

  const user = useSelector(selectUser);

  const clients = useQuery('clients').filtered('user == $0 && status == "Active"', new BSON.ObjectID(user?._id))

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

  const getPageContent = useMemo(() => {
    switch (activeTab) {
      case 'All':
        return (
          <View style={{ display: 'flex', flex: 1 }}>
            <ExpenseOverview
              isEstimate={isEstimate}
              searchTerm={searchTerm}
              clients={searchedClientIds}
            />
          </View>
        );
      default:
        return null;
    }
  }, [activeTab, searchTerm]);

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
  }, [route.params]);

  const uploadFile = async (asset: any) => {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: isIOS ? asset.path.replace('file://', '') : asset.path,
        name: getFileNameFromUri(asset.path),
        type: asset.type || 'image/jpeg',
      });

      console.log('formData', formData);
      const result = await api.post(ApiRequestEnum.ATTACHMENTS_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return result.data.Location;
    } catch (e) {
      return '';
    }
  };

  const handleScan = () => {
    ImagePicker.openCamera({
      cropping: true,
      showCropFrame: true,
    }).then(async (image) => {
      const fileLocation = await uploadFile(image);
      navigation.navigate(MainStackRouteNames.ExpenseScan, {
        image: fileLocation,
      })
    });
    // ImagePicker.openPicker({
    //   cropping: true,
    // }).then(async (image) => {
    //   const fileLocation = await uploadFile(image);
    //   navigation.navigate(MainStackRouteNames.ExpenseScan, {
    //     image: fileLocation,
    //   })
    // });
  }

  const handleSelect = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then(async (image) => {
      const fileLocation = await uploadFile(image);
      navigation.navigate(MainStackRouteNames.ExpenseScan, {
        image: fileLocation,
      })
    });
  }

  const handleNewExpense = () => {
    navigation.navigate(MainStackRouteNames.ExpenseSingle, {
      image: '',
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Expenses'}
        rightSideComponent={rightComponent}
        showBackBtn={false}
        onBackPress={() => {
          navigation.jumpTo(MainBottomTabsRouteNames.Home)
        }}
      >
      </Header>
      <PageContainer roundLeftTopBorder={false}>
        {getPageContent}
      </PageContainer>
      <View style={{ padding: 10 }}>
        <Button
          text={'Add New Expense'}
          onPress={handleNewExpense}
          type={BtnType.Primary}
        />

        <TouchableOpacity
          onPress={() => handleScan()}
          activeOpacity={0.6}
          style={styles.centralButtonBlock}>
          <LinearGradientComponent
            {...gradients.purpleGradient}
            style={styles.centralButton}>
            <ScanIcon size={27} color={colors.whiteColor} />
            <Text style={{ fontSize: 10, fontWeight: '400', color: colors.whiteColor }}>Scan</Text>
          </LinearGradientComponent>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => handleSelect()}
          activeOpacity={0.6}
          style={styles.addButtonBlock}>
          <LinearGradientComponent
            {...gradients.purpleGradient}
            style={styles.centralButton}>
            <PlusIcon size={20} color={colors.whiteColor} />
            <Text style={{ fontSize: 10, fontWeight: '400', color: colors.whiteColor }}>Select</Text>
          </LinearGradientComponent>
        </TouchableOpacity> */}
      </View>
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
  centralButtonBlock: {
    width: 53,
    height: 53,
    position: 'absolute',
    bottom: 60,
    left: '95%',
    overflow: 'hidden',
    borderRadius: 53,
    transform: [{ translateX: -20 }],
  },
  centralButton: {
    width: 53,
    height: 53,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonBlock: {
    width: 53,
    height: 53,
    position: 'absolute',
    bottom: 80,
    left: '95%',
    overflow: 'hidden',
    borderRadius: 53,
    transform: [{ translateX: -20 }],
  },
});
