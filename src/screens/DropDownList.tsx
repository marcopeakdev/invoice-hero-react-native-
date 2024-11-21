import React, {useState} from 'react';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {BtnType, Button} from '../components/Button';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Card} from '../components/Card';
import {SelectedItemIcon} from '../components/icons/SelectedItemIcon';
import {colors} from '../styles/colors';
import {font} from '../styles/font';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.DropDownList>;
  navigation: NativeStackNavigationProp<MainStackParamList, any>;
};

export const DropDownList: React.FC<Props> = ({route, navigation}) => {
  const [selectedItem, setSelectedItem] = useState(
    route.params?.selectedValue || null,
  );
  const insets = useSafeAreaInsets();

  const onSave = () => {
    if (route.params.callback) {
      route.params.callback({
        [route.params.returnValueName]: selectedItem,
      })
      navigation.goBack();
    } else {
      navigation.navigate<any>(route.params.backScreen, {
        [route.params.returnValueName]: selectedItem,
      });
    }
  
  };

  const onCancel = () => {
    navigation.navigate<any>(route.params.backScreen);
  };

  return (
    <View style={styles.container}>
      <Header title={route.params.title} showBackBtn={true} />
      <PageContainer>
        <ScrollView style={styles.container}>
          {route.params.list.map((item, index) => {
            return (
              <Card
                key={`dropdown_item_${index}`}
                onPress={() => setSelectedItem(item.value)}
                containerStyle={styles.selectContainer}>
                <View style={styles.listItem}>
                  <Text style={styles.label}>{item.label}</Text>
                  <SelectedItemIcon selected={selectedItem === item.value} />
                </View>
              </Card>
            );
          })}
        </ScrollView>
        <View style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
          <Button
            text={'Save'}
            containerStyle={styles.action}
            onPress={onSave}
            disabled={selectedItem === null}
          />
          <Button
            text={'Cancel'}
            type={BtnType.Outlined}
            containerStyle={styles.action}
            onPress={onCancel}
          />
        </View>
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
  selectContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    ...font(14, 16),
    color: colors.text.darkGrayText,
  },
  icon: {},
});
