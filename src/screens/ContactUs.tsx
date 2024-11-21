import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {commonText} from '../styles/common';

export const ContactUs = () => {
  return (
    <View style={styles.container}>
      <Header title={'Contact Us'} showBackBtn={true} />
      <PageContainer>
        <ScrollView style={styles.scrollContainer}>
          <Text style={commonText.paragraphText}>
            Contact us at <Text style={commonText.bold}>support@invoicehero.com</Text>
            .
          </Text>
        </ScrollView>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
});
