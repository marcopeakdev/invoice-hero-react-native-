import {colors} from './colors';
import {font} from './font';
import {StyleSheet} from 'react-native';

export const commonText = StyleSheet.create({
  paragraphText: {
    ...font(14, 16),
    marginBottom: 14,
    color: colors.text.grayText,
  },
  bold: {
    fontWeight: '700',
  },
  titleH1: {
    ...font(24, 26),
    color: colors.text.grayText,
    marginBottom: 16,
  },
  titleH2: {
    ...font(18, 20),
    color: colors.text.grayText,
    marginBottom: 16,
  },
  titleH3: {
    ...font(16, 18),
    color: colors.text.grayText,
    marginBottom: 16,
  },
  listItem: {
    paddingLeft: 20,
  },
});

export const commonView = StyleSheet.create({
  commonShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 7,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRowValue: {
    ...font(14, 21),
    color: colors.text.grayText,
  },
  cardRowPlaceholder: {
    color: colors.lightGray,
    ...font(14, 21),
  },
});

export const commonInput = StyleSheet.create({
  container: {
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  input: {
    color: colors.text.grayText,
    ...font(14, 20),
    width: '100%',
    height: 24,
    padding: 0,
  },
});

export const commonMargin = StyleSheet;
