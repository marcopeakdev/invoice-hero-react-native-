import moment from 'moment';
import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { selectBusiness } from '../store/selectors/business';
import { colors } from '../styles/colors';
import { font } from '../styles/font';
import { currencyFormatter } from '../utils/currency';

type Props = {
  onSearch?: (val: string) => void;
  data: any;
};

export const CustomInvoice: React.FC<Props> = ({ data }) => {
  const { number, date, billTo, items, createdAt, paidDate, note, attachments, signature } = data;
  const business = useSelector(selectBusiness);

  const formattedAddress = useMemo(() => {
    const array = [];

    if (business.result?.address?.street) {
      array.push(business.result?.address?.street);
    }

    if (business.result?.address?.city) {
      array.push(business.result?.address?.city);
    }

    if (business.result?.address?.zip) {
      array.push(business.result?.address?.zip);
    }

    return array.length ? array.join(', ') : ''
  }, [business.result]);

  const country = useMemo(() => {
    return business.result?.address?.country || ''
  }, [business.result])

  const businessName = useMemo(() => {
    return business.result?.name || ''
  }, [business.result])

  const businessLogo = useMemo(() => {
    return business.result?.logo || ''
  }, [business.result])

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <View>
            <View>
              <Text style={[styles.headerText1]}>{`INV ${number}`}</Text>
              <Text style={[styles.issueDateText]}>Issue date</Text>
              <Text style={[styles.titleText]}>{date}</Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={styles.headerText1}>{businessName}</Text>
              <Text style={styles.titleText}>{formattedAddress}</Text>
              <Text style={styles.titleText}>{country}</Text>
            </View>
          </View>
          <View>
            <FastImage
              source={{ uri: businessLogo }}
              style={{ width: 100, height: 50 }}
              resizeMode={'contain'}
            />
          </View>
        </View>
        <View style={styles.inforContainer}>
          <View style={styles.inforBody}>
            <Text style={styles.headerText1}>{'Customer'}</Text>
            <Text style={styles.titleText}>{billTo?.name || ''}</Text>
            <Text style={styles.titleText}>{billTo?.address?.street}, {billTo?.address?.city}, {billTo?.address?.zip}</Text>
            <Text style={styles.titleText}>{billTo?.address?.country || ''}</Text>
          </View>
          <View style={styles.inforBody}>
            <Text style={styles.headerText1}>{'Invoice Detail'}</Text>
            <Text style={styles.titleText}>PDF created {createdAt}</Text>
          </View>
          <View style={styles.inforBody}>
            <Text style={styles.headerText1}>{'Payment'}</Text>
            <Text style={styles.titleText}>{paidDate}</Text>
            <Text style={styles.titleText}>{currencyFormatter.format(items?.total || 0)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <View style={[{ flex: 0.7 }]}>
          <Text style={styles.headerText1}>Item</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginLeft: 10,
          }}>
          <View style={styles.sBox}>
            <Text style={[styles.headerText1, styles.rightText]}>Quantity</Text>
          </View>
          <View style={styles.sBox}>
            <Text style={[styles.headerText1, styles.rightText]}>Price</Text>
          </View>
          <View style={styles.sBox}>
            <Text style={[styles.headerText1, styles.rightText]}>Amount</Text>
          </View>
        </View>
      </View>

      {items?.items?.filter((item: any) => item.selected).map((x: any, key: number) => (
        <View key={key} style={[styles.box, { marginTop: 1 }]}>
          <View style={{ flex: 0.7 }}>
            <Text style={styles.text}>{x?.description}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginLeft: 10,
            }}>
            <View style={styles.sBox}>
              <Text style={[styles.text, styles.rightText]}>{x?.hours}</Text>
            </View>
            <View style={styles.sBox}>
              <Text style={[styles.text, styles.rightText]}>{currencyFormatter.format(x?.rate)}</Text>
            </View>
            <View style={styles.sBox}>
              <Text style={[styles.text, styles.rightText]}>{currencyFormatter.format(x?.rate * x?.hours)}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.summaryContainer}>
        <View style={styles.sBox}>
          <Text style={styles.text1}>Sub Total: </Text>
          <Text style={styles.text1}>Tax: </Text>
          <Text style={styles.text1}>Discount: </Text>
          <Text style={styles.text1}>Deposit: </Text>
        </View>
        <View style={styles.sBox}>
          <Text style={[styles.text1, styles.rightText]}>{currencyFormatter.format(items?.subTotal || 0)}</Text>
          <Text style={[styles.text1, styles.rightText]}>{items?.taxRate || 0}%</Text>
          <Text style={[styles.text1, styles.rightText]}>{currencyFormatter.format(items?.discount || 0)}</Text>
          <Text style={[styles.text1, styles.rightText]}>{currencyFormatter.format(items?.deposit || 0)}</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.sBox}>
          <Text style={styles.summaryText}>Total Due:</Text>
        </View>
        <View style={styles.sBox}>
          <Text style={[styles.summaryText, styles.rightText]}>{currencyFormatter.format(items?.total || 0)}</Text>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.noteContainer}>
          {note && (
            <>
              <Text style={styles.headerText1}>Note:</Text>
              <Text style={styles.noteText}>{note}</Text>
            </>
          )}
        </View>
        <View style={styles.signatureContainer}>
          {signature && (
            <>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={styles.signature}
                source={{ uri: signature.uri }}
              />
              <View style={styles.textContainer}>
                <Text style={styles.headerText1}>Date Signed</Text>
                <Text style={{ fontSize: 12 }}>{moment(signature.createdAt).format('MM/DD/yyyy')}</Text>
              </View>
            </>
          )}
        </View>
      </View>
      {(attachments && attachments.length > 0) && (
        <View style={styles.attachmentsContainer}>
          {attachments.map((attach: any, key: number) => (
            <View key={`attachment_${key}`} style={styles.attachmentRow}>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={styles.image}
                source={{ uri: attach }}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: 16,
    marginBottom: 4,
  },
  headerText1: {
    ...font(12, 14, '500'),
  },
  issueDateText: {
    ...font(10, 12, '500'),
    marginTop: 8
  },
  titleText: {
    ...font(10, 12),
  },
  inforHeader: {
    ...font(20, 22, '600'),
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12
  },
  inforContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 4,
  },
  inforBody: {
    width: '32%', borderTopColor: colors.lightGray, borderTopWidth: 1, paddingTop: 10
  },
  rightText: {
    textAlign: 'right'
  },
  summaryContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 16,
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    paddingVertical: 8
  },
  summaryText: {
    ...font(18, 20, '500'),
    marginVertical: 8
  },
  headerText2: {
    ...font(32, 39, '700'),
  },
  headerText3: {
    fontSize: 14,
    ...font(16, 18, '500'),
    color: colors.whiteColor,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 16
  },
  text: {
    ...font(10, 11, '400'),
    paddingTop: 4,
  },
  text1: {
    ...font(10, 11, '600'),
    paddingTop: 4,
  },
  sBox: {
    flex: 1,
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noteContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
    flex: 1,
  },
  noteText: {
    ...font(10, 11, '400'),
    paddingTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.screenBackground,
  },
  signatureContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
  },
  textContainer: {
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  signature: {
    width: 200,
    height: 100,
  },
  labelText: {
    ...font(12, 14, '700'),
    textTransform: 'uppercase',
  },
  attachmentsContainer: {
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  attachmentRow: {
    marginVertical: 5,
  }
});
