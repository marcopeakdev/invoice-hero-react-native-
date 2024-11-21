import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import { MainStackRouteNames, SettingsStackRouteNames } from '../navigation/router-names';
import { SettingRouterParamList } from '../navigation/SettingsStackNavigator';
import {commonText} from '../styles/common';

type Props = {
  route: RouteProp<SettingRouterParamList, SettingsStackRouteNames.Privacy>;
  navigation: NativeStackNavigationProp<
    SettingRouterParamList,
    SettingsStackRouteNames.Privacy
  >;
};

export const Privacy: React.FC<Props> = ({ route, navigation }) => {
  const onBackPress = () => {
    if (route?.params?.isSubscription) {
      navigation.goBack();
      navigation.navigate(MainStackRouteNames.SubscriptionModal)
    } else {
      navigation.goBack();
    }
  }
  
  return (
    <View style={styles.container}>
      <Header title={'Privacy'} showBackBtn={true} onBackPress={onBackPress} />
      <PageContainer>
        <ScrollView style={styles.scrollContainer}>
          <Text style={commonText.paragraphText}>
            Last updated: August 16, 2022
          </Text>
          <Text style={commonText.paragraphText}>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </Text>
          <Text style={commonText.paragraphText}>
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </Text>
          <Text style={commonText.titleH1}>Interpretation and Definitions</Text>
          <Text style={commonText.titleH2}>Interpretation</Text>
          <Text style={commonText.paragraphText}>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </Text>
          <Text style={commonText.titleH2}>Definitions</Text>
          <Text style={commonText.paragraphText}>
            For the purposes of this Privacy Policy:
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Account</Text> means a unique
            account created for You to access our Service or parts of our
            Service.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Affiliate</Text> means an entity
            that controls, is controlled by or is under common control with a
            party, where "control" means ownership of 50% or more of the shares,
            equity interest or other securities entitled to vote for election of
            directors or other managing authority.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Application</Text> means the
            software program provided by the Company downloaded by You on any
            electronic device, named Invoice Hero
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Company</Text> (referred to as
            either "the Company", "We", "Us" or "Our" in this Agreement) refers
            to Tecio, 19710 89th Pl NE, bothell, WA, 98011.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Country</Text> refers to:
            Washington, United States
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Device</Text> means any device that
            can access the Service such as a computer, a cellphone or a digital
            tablet.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Personal Data</Text> is any
            information that relates to an identified or identifiable
            individual.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Service</Text> refers to the
            Application.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Service Provider</Text> means any
            natural or legal person who processes the data on behalf of the
            Company. It refers to third-party companies or individuals employed
            by the Company to facilitate the Service, to provide the Service on
            behalf of the Company, to perform services related to the Service or
            to assist the Company in analyzing how the Service is used
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>
              - Third-party Social Media Service
            </Text>{' '}
            refers to any website or any social network website through which a
            User can log in or create an account to use the Service.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Usage Data</Text> refers to data
            collected automatically, either generated by the use of the Service
            or from the Service infrastructure itself (for example, the duration
            of a page visit).
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- You</Text> means the individual
            accessing or using the Service, or the company, or other legal
            entity on behalf of which such individual is accessing or using the
            Service, as applicable.
          </Text>
          <Text style={commonText.titleH2}>
            Collecting and Using Your Personal Data
          </Text>
          <Text style={commonText.titleH2}>Types of Data Collected</Text>
          <Text style={commonText.titleH3}>Personal Data</Text>
          <Text style={commonText.paragraphText}>
            While using Our Service, We may ask You to provide Us with certain
            personally identifiable information that can be used to contact or
            identify You. Personally identifiable information may include, but
            is not limited to:
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Email address
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            First name and last name
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Phone number
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Usage Data
          </Text>
          <Text style={commonText.titleH3}>Usage Data</Text>
          <Text style={commonText.paragraphText}>
            Usage Data is collected automatically when using the Service.
          </Text>
          <Text style={commonText.paragraphText}>
            Usage Data may include information such as Your Device's Internet
            Protocol address (e.g. IP address), browser type, browser version,
            the pages of our Service that You visit, the time and date of Your
            visit, the time spent on those pages, unique device identifiers and
            other diagnostic data.
          </Text>
          <Text style={commonText.paragraphText}>
            When You access the Service by or through a mobile device, We may
            collect certain information automatically, including, but not
            limited to, the type of mobile device You use, Your mobile device
            unique ID, the IP address of Your mobile device, Your mobile
            operating system, the type of mobile Internet browser You use,
            unique device identifiers and other diagnostic data.
          </Text>
          <Text style={commonText.paragraphText}>
            We may also collect information that Your browser sends whenever You
            visit our Service or when You access the Service by or through a
            mobile device.
          </Text>
          <Text style={commonText.titleH3}>
            Information from Third-Party Social Media Services
          </Text>
          <Text style={commonText.paragraphText}>
            The Company allows You to create an account and log in to use the
            Service through the following Third-party Social Media Services:
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Google
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Facebook
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Twitter
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            LinkedIn
          </Text>
          <Text style={commonText.paragraphText}>
            If You decide to register through or otherwise grant us access to a
            Third-Party Social Media Service, We may collect Personal data that
            is already associated with Your Third-Party Social Media Service's
            account, such as Your name, Your email address, Your activities or
            Your contact list associated with that account.
          </Text>
          <Text style={commonText.paragraphText}>
            You may also have the option of sharing additional information with
            the Company through Your Third-Party Social Media Service's account.
            If You choose to provide such information and Personal Data, during
            registration or otherwise, You are giving the Company permission to
            use, share, and store it in a manner consistent with this Privacy
            Policy.
          </Text>
          <Text style={commonText.titleH2}>Use of Your Personal Data</Text>
          <Text style={commonText.paragraphText}>
            The Company may use Personal Data for the following purposes:
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>
              - To provide and maintain our Service
            </Text>
            , including to monitor the usage of our Service.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- To manage Your Account:</Text> to
            manage Your registration as a user of the Service. The Personal Data
            You provide can give You access to different functionalities of the
            Service that are available to You as a registered user.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>
              - For the performance of a contract:
            </Text>{' '}
            the development, compliance and undertaking of the purchase contract
            for the products, items or services You have purchased or of any
            other contract with Us through the Service.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- To contact You:</Text> To contact
            You by email, telephone calls, SMS, or other equivalent forms of
            electronic communication, such as a mobile application's push
            notifications regarding updates or informative communications
            related to the functionalities, products or contracted services,
            including the security updates, when necessary or reasonable for
            their implementation.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- To provide You</Text> with news,
            special offers and general information about other goods, services
            and events which we offer that are similar to those that you have
            already purchased or enquired about unless You have opted not to
            receive such information.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- To manage Your requests:</Text> To
            attend and manage Your requests to Us.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- For business transfers:</Text> We
            may use Your information to evaluate or conduct a merger,
            divestiture, restructuring, reorganization, dissolution, or other
            sale or transfer of some or all of Our assets, whether as a going
            concern or as part of bankruptcy, liquidation, or similar
            proceeding, in which Personal Data held by Us about our Service
            users is among the assets transferred.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- For other purposes</Text>: We may
            use Your information for other purposes, such as data analysis,
            identifying usage trends, determining the effectiveness of our
            promotional campaigns and to evaluate and improve our Service,
            products, services, marketing and your experience.
          </Text>
          <Text style={commonText.paragraphText}>
            We may share Your personal information in the following situations:
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- With Service Providers:</Text> We
            may share Your personal information with Service Providers to
            monitor and analyze the use of our Service, for payment processing,
            to contact You.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- For business transfers:</Text> We
            may share or transfer Your personal information in connection with,
            or during negotiations of, any merger, sale of Company assets,
            financing, or acquisition of all or a portion of Our business to
            another company.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- With Affiliates:</Text> We may share
            Your information with Our affiliates, in which case we will require
            those affiliates to honor this Privacy Policy. Affiliates include
            Our parent company and any other subsidiaries, joint venture
            partners or other companies that We control or that are under common
            control with Us.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- With business partners:</Text> We
            may share Your information with Our business partners to offer You
            certain products, services or promotions.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- With other users:</Text> when You
            share personal information or otherwise interact in the public areas
            with other users, such information may be viewed by all users and
            may be publicly distributed outside. If You interact with other
            users or register through a Third-Party Social Media Service, Your
            contacts on the Third-Party Social Media Service may see Your name,
            profile, pictures and description of Your activity. Similarly, other
            users will be able to view descriptions of Your activity,
            communicate with You and view Your profile.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- With Your consent</Text>: We may
            disclose Your personal information for any other purpose with Your
            consent.
          </Text>
          <Text style={commonText.titleH2}>
            Retention of Your Personal Data
          </Text>
          <Text style={commonText.paragraphText}>
            The Company will retain Your Personal Data only for as long as is
            necessary for the purposes set out in this Privacy Policy. We will
            retain and use Your Personal Data to the extent necessary to comply
            with our legal obligations (for example, if we are required to
            retain your data to comply with applicable laws), resolve disputes,
            and enforce our legal agreements and policies.
          </Text>
          <Text style={commonText.paragraphText}>
            The Company will also retain Usage Data for internal analysis
            purposes. Usage Data is generally retained for a shorter period of
            time, except when this data is used to strengthen the security or to
            improve the functionality of Our Service, or We are legally
            obligated to retain this data for longer time periods.
          </Text>
          <Text style={commonText.titleH2}>Transfer of Your Personal Data</Text>
          <Text style={commonText.paragraphText}>
            Your information, including Personal Data, is processed at the
            Company's operating offices and in any other places where the
            parties involved in the processing are located. It means that this
            information may be transferred to — and maintained on — computers
            located outside of Your state, province, country or other
            governmental jurisdiction where the data protection laws may differ
            than those from Your jurisdiction.
          </Text>
          <Text style={commonText.paragraphText}>
            Your consent to this Privacy Policy followed by Your submission of
            such information represents Your agreement to that transfer.
          </Text>
          <Text style={commonText.paragraphText}>
            The Company will take all steps reasonably necessary to ensure that
            Your data is treated securely and in accordance with this Privacy
            Policy and no transfer of Your Personal Data will take place to an
            organization or a country unless there are adequate controls in
            place including the security of Your data and other personal
            information.
          </Text>
          <Text style={commonText.titleH2}>
            Disclosure of Your Personal Data
          </Text>
          <Text style={commonText.titleH3}>Business Transactions</Text>
          <Text style={commonText.paragraphText}>
            If the Company is involved in a merger, acquisition or asset sale,
            Your Personal Data may be transferred. We will provide notice before
            Your Personal Data is transferred and becomes subject to a different
            Privacy Policy.
          </Text>
          <Text style={commonText.titleH3}>Law enforcement</Text>
          <Text style={commonText.paragraphText}>
            Under certain circumstances, the Company may be required to disclose
            Your Personal Data if required to do so by law or in response to
            valid requests by public authorities (e.g. a court or a government
            agency).
          </Text>
          <Text style={commonText.titleH3}>Other legal requirements</Text>
          <Text style={commonText.paragraphText}>
            The Company may disclose Your Personal Data in the good faith belief
            that such action is necessary to:
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Comply with a legal obligation
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Protect and defend the rights or property of the Company
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Prevent or investigate possible wrongdoing in connection with the
            Service
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Protect the personal safety of Users of the Service or the public
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            Protect against legal liability
          </Text>
          <Text style={commonText.titleH2}>Security of Your Personal Data</Text>
          <Text style={commonText.paragraphText}>
            The security of Your Personal Data is important to Us, but remember
            that no method of transmission over the Internet, or method of
            electronic storage is 100% secure. While We strive to use
            commercially acceptable means to protect Your Personal Data, We
            cannot guarantee its absolute security.
          </Text>
          <Text style={commonText.titleH1}>
            Detailed Information on the Processing of Your Personal Data
          </Text>
          <Text style={commonText.paragraphText}>
            The Service Providers We use may have access to Your Personal Data.
            These third-party vendors collect, store, use, process and transfer
            information about Your activity on Our Service in accordance with
            their Privacy Policies.
          </Text>
          <Text style={commonText.titleH2}>Payments</Text>
          <Text style={commonText.paragraphText}>
            We may provide paid products and/or services within the Service. In
            that case, we may use third-party services for payment processing
            (e.g. payment processors).
          </Text>
          <Text style={commonText.paragraphText}>
            We will not store or collect Your payment card details. That
            information is provided directly to Our third-party payment
            processors whose use of Your personal information is governed by
            their Privacy Policy. These payment processors adhere to the
            standards set by PCI-DSS as managed by the PCI Security Standards
            Council, which is a joint effort of brands like Visa, Mastercard,
            American Express and Discover. PCI-DSS requirements help ensure the
            secure handling of payment information.
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            <Text style={commonText.bold}>- Google Play In-App Payments</Text>{' '}
            Their Privacy Policy can be viewed at
            https://www.google.com/policies/privacy/
          </Text>
          <Text style={commonText.titleH1}>Children's Privacy</Text>
          <Text style={commonText.paragraphText}>
            Our Service does not address anyone under the age of 13. We do not
            knowingly collect personally identifiable information from anyone
            under the age of 13. If You are a parent or guardian and You are
            aware that Your child has provided Us with Personal Data, please
            contact Us. If We become aware that We have collected Personal Data
            from anyone under the age of 13 without verification of parental
            consent, We take steps to remove that information from Our servers.
          </Text>
          <Text style={commonText.paragraphText}>
            If We need to rely on consent as a legal basis for processing Your
            information and Your country requires consent from a parent, We may
            require Your parent's consent before We collect and use that
            information.
          </Text>
          <Text style={commonText.titleH1}>Links to Other Websites</Text>
          <Text style={commonText.paragraphText}>
            Our Service may contain links to other websites that are not
            operated by Us. If You click on a third party link, You will be
            directed to that third party's site. We strongly advise You to
            review the Privacy Policy of every site You visit.
          </Text>
          <Text style={commonText.paragraphText}>
            We have no control over and assume no responsibility for the
            content, privacy policies or practices of any third party sites or
            services.
          </Text>
          <Text style={commonText.titleH1}>Changes to this Privacy Policy</Text>
          <Text style={commonText.paragraphText}>
            We may update Our Privacy Policy from time to time. We will notify
            You of any changes by posting the new Privacy Policy on this page.
          </Text>
          <Text style={commonText.paragraphText}>
            We will let You know via email and/or a prominent notice on Our
            Service, prior to the change becoming effective and update the "Last
            updated" date at the top of this Privacy Policy.
          </Text>
          <Text style={commonText.paragraphText}>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </Text>
          <Text style={commonText.titleH1}>Contact Us</Text>
          <Text style={commonText.paragraphText}>
            If you have any questions about this Privacy Policy, You can contact
            us:
          </Text>
          <Text style={[commonText.paragraphText, commonText.listItem]}>
            - By email: support@tecio.com
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
