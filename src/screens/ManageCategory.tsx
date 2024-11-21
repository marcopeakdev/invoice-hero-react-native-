import React from 'react';
import {Header} from '../components/Header';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PageContainer} from '../components/PageContainer';
import {useDispatch, useSelector} from 'react-redux';
import {selectCategories} from '../store/selectors/categories';
import {Card} from '../components/Card';
import {commonView} from '../styles/common';
import {TrashIcon} from '../components/icons/TrashIcon';
import {PlusIcon} from '../components/icons/PlusIcon';
import {colors} from '../styles/colors';
import {Category} from '../models/category';
import {updateCategory} from '../store/thunk/categories';
import {ActiveStatus} from '../models/common';
import {RouteProp} from '@react-navigation/native';
import {SettingsStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SettingRouterParamList} from '../navigation/SettingsStackNavigator';

type Props = {
  route: RouteProp<
    SettingRouterParamList,
    SettingsStackRouteNames.ManageCategory
  >;
  navigation: NativeStackNavigationProp<
    SettingRouterParamList,
    SettingsStackRouteNames.ManageCategory
  >;
};

export const ManageCategory: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch<any>();
  const categories = useSelector(selectCategories);

  const deactivateCategory = (category: Category) => {
    dispatch(
      updateCategory({
        id: category._id,
        status: ActiveStatus.Inactive,
      }),
    );
  };

  const addNewCategory = () => {
    navigation.navigate(SettingsStackRouteNames.AddCategory);
  };

  return (
    <View style={styles.container}>
      <Header title={'Manage Categories'} showBackBtn={true} />
      <PageContainer>
        <ScrollView style={styles.container}>
          {categories.map(category => {
            return (
              <Card key={category.name} containerStyle={styles.field}>
                <View style={commonView.cardRow}>
                  <Text style={commonView.cardRowValue}>{category.name}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => deactivateCategory(category)}>
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
          <Card onPress={addNewCategory} containerStyle={styles.field}>
            <View style={commonView.cardRow}>
              <Text style={commonView.cardRowValue}>Add new category</Text>
              <PlusIcon size={20} color={colors.gray} />
            </View>
          </Card>
        </ScrollView>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    paddingHorizontal: 24,
  },
  action: {
    marginTop: 16,
  },
  field: {
    marginBottom: 16,
  },
});
