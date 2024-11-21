import React from 'react';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {StyleSheet, View} from 'react-native';
import {EmptyResult} from '../components/EmptyResult';

export const Notifications: React.FC<{}> = () => {
  return (
    <View style={styles.container}>
      <Header title={'Notifications'} showBackBtn={true} />
      <PageContainer>
        <EmptyResult
          title={"You don't have any notifications"}
          description={
            'Notifications tell you when your customers paid your invoices or their invoices are overdue'
          }
        />
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
