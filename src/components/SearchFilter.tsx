import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import CalendarPicker from 'react-native-calendar-picker';
import {ArrowDownIcon} from './icons/ArrowDown';
import {colors} from '../styles/colors';
import {font} from '../styles/font';
import {BtnType, Button} from './Button';
import {SearchFilterAmount} from './SearchFilterAmount';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {selectCategories} from '../store/selectors/categories';
import {Category} from '../models/category';
import {toggleArrayItem} from '../utils/array.tools';
import {Card} from './Card';
import {CheckboxIcon} from './icons/Checkbox';
import {EmptyCheckboxIcon} from './icons/EmptyCheckbox';
import {ArrowLeftIcon} from './icons/ArrowLeftIcon';
import {ArrowRightIcon} from './icons/ArrowRightIcon';
import {clearFilter, setFilter} from '../store/reducers/clients';
import {selectFilter} from '../store/selectors/clients';
import moment from 'moment';

type Props = {
  closeFilter: () => void;
};

export const SearchFilter: React.FC<Props> = ({closeFilter}) => {
  const dispatch = useDispatch();
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const categories = useSelector(selectCategories);
  const filter = useSelector(selectFilter);

  const onSubmit = values => {
    dispatch(setFilter(values));
    closeFilter();
  };

  const formik = useFormik({
    initialValues: {
      start: filter.start || '',
      end: filter.end || '',
      categories: [],
      min: '',
      max: '',
    },
    onSubmit,
  });

  useEffect(() => {
    formik.setValues(filter as unknown as any);
  }, [filter]);

  const onPress = (category: Category) => {
    const result = toggleArrayItem(formik.values.categories, category._id);

    formik.setFieldValue('categories', result);
  };

  const onClear = () => {
    dispatch(clearFilter());
    closeFilter();
  };

  const sections = [
    {
      title: 'Date range',
      content: (
        <View style={styles.dateContainer}>
          <CalendarPicker
            width={Dimensions.get('window').width - 15}
            selectedStartDate={
              formik.values.start
                ? moment(formik.values.start).toDate()
                : undefined
            }
            selectedEndDate={
              formik.values.end ? moment(formik.values.end).toDate() : undefined
            }
            previousComponent={
              <ArrowLeftIcon size={24} color={colors.bluePrimary} />
            }
            nextComponent={
              <ArrowRightIcon size={24} color={colors.bluePrimary} />
            }
            monthTitleStyle={{
              color: colors.bluePrimary,
              fontWeight: '500',
            }}
            yearTitleStyle={{
              color: colors.bluePrimary,
              fontWeight: '500',
            }}
            selectedRangeStartStyle={{
              backgroundColor: colors.bluePrimary,
            }}
            selectedRangeEndStyle={{
              backgroundColor: colors.bluePrimary,
            }}
            selectedRangeStyle={{
              backgroundColor: '#d8dcf1',
            }}
            dayLabelsWrapper={{
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            customDayHeaderStyles={() => {
              return {
                style: {},
                textStyle: {
                  color: colors.bluePrimary,
                  fontWeight: '500',
                },
              };
            }}
            allowRangeSelection={true}
            onDateChange={(date, d) => {
              if (d === 'START_DATE') {
                formik.setFieldValue('start', date ? date.toDate() : '');
              } else {
                formik.setFieldValue('end', date ? date.toDate() : '');
              }
            }}
            textStyle={{
              fontSize: 14,
              color: colors.text.darkGrayText,
            }}
          />
        </View>
      ),
    },
    {
      title: 'Categories',
      content: (
        <View style={styles.container}>
          {categories.map(category => {
            return (
              <Card
                onPress={() => onPress(category)}
                key={`category_${category._id}`}
                containerStyle={styles.card}>
                {formik.values.categories.includes(category._id) ? (
                  <CheckboxIcon />
                ) : (
                  <EmptyCheckboxIcon />
                )}
                <Text numberOfLines={1} style={styles.categoryName}>
                  {category.name}
                </Text>
              </Card>
            );
          })}
        </View>
      ),
    },
    {
      title: 'Amount',
      content: (
        <SearchFilterAmount
          values={formik.values}
          setFieldValue={formik.setFieldValue}
        />
      ),
    },
  ];

  const renderHeader = (section: any, index: number) => {
    return (
      <View
        style={[
          styles.section,
          !activeSections.includes(index) && styles.sectionNotActive,
        ]}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View
          style={[
            styles.sectionIcon,
            !activeSections.includes(index) && styles.sectionIconActive,
          ]}>
          <ArrowDownIcon color={colors.gray} />
        </View>
      </View>
    );
  };

  const onChange = (indexes: number[]) => {
    setActiveSections(indexes);
  };

  const renderContent = useCallback((section: any) => {
    return <View style={styles.sectionContent}>{section.content}</View>;
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Accordion
        activeSections={activeSections}
        sections={sections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={onChange}
        underlayColor={'transparent'}
        expandMultiple={true}
      />
      <View style={styles.actions}>
        <Button
          text={'Apply'}
          onPress={formik.handleSubmit}
          containerStyle={styles.action}
        />
        <Button
          text={'Clear all'}
          type={BtnType.Outlined}
          onPress={onClear}
          containerStyle={styles.action}
        />
        <Button
          text={'Cancel'}
          type={BtnType.Outlined}
          onPress={() => closeFilter()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 'auto',
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
    transform: [{rotate: '180deg'}],
  },
  sectionTitle: {
    color: colors.text.grayText,
    ...font(16, 24),
  },
  sectionContent: {
    paddingTop: 10,
  },
  actions: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  action: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    top: 1,
    marginLeft: 30,
    color: colors.text.grayText,
    ...font(14, 15, '500'),
  },
  dateContainer: {
    marginHorizontal: 24,
  },
});
