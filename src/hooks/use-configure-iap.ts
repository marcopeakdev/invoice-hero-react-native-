import {useEffect} from 'react';
import {EmitterSubscription} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  initConnection,
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
  validateReceiptIos,
} from 'react-native-iap';
import {useDispatch} from 'react-redux';
import {api, ApiRequestEnum} from '../utils/api';
import {isAndroid, isIOS} from '../utils/constants';
import {getUser} from '../store/thunk/user';

export const useConfigureInAppPurchase = () => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    let purchaseUpdateSubscription: EmitterSubscription;
    let purchaseErrorSubscription: EmitterSubscription;

    const initialize = async () => {
      try {
        const result = await initConnection();
        console.log('[IAP] Init connection', result);

        if (isAndroid) {
          await flushFailedPurchasesCachedAsPendingAndroid();

          const subscriptionPurchase = await getAvailablePurchases(); // uses IAP.getAvailablePurchases()
          if (subscriptionPurchase?.length) {
            await api.post(ApiRequestEnum.APPLY_SUBSCRIPTIONS, {
              token: subscriptionPurchase[0].transactionReceipt,
              platform: 'ANDROID',
            });

            dispatch(getUser());
          } else {
            // await this.store.dispatch(user.actions.revokeProSubscription());
          }
        }
      } catch (error) {
        console.error('[IAP] Initialize', (error as Error).message);
        // handleError(error);
        // logError(error, 'iap', {acton: 'initialize'});
        return;
      }

      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: SubscriptionPurchase | ProductPurchase) => {
          console.log('[IAP] Purchase updated', {purchase});

          try {
            const {data} = await api.post(ApiRequestEnum.APPLY_SUBSCRIPTIONS, {
              token: purchase.transactionReceipt,
              platform: isIOS ? 'IOS' : 'ANDROID',
            });
            const receipt = purchase.transactionReceipt;
            if (isIOS) {
              await validateReceiptIos({
                receiptBody: {
                  'receipt-data': receipt,
                }
              });
            }
            await finishTransaction({purchase, isConsumable: false});

            dispatch(getUser());

            showMessage({
              message: 'Thank you for purchasing a subscription',
              type: 'success',
            });

            // dispatch(setSubscription(applyPurchaseResult.subscription));
          } catch (error) {
            console.log(`[IAP] error: ${error?.message}`);
            showMessage({
              message: 'Cant validate your purchase',
              type: 'danger',
            });
            return;
          }
        },
      );

      purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.log('[IAP] Purchase error', error);
          showMessage({
            message: error?.message ?? 'Cant buy this subscription',
            type: 'danger',
          });
        },
      );
    };

    initialize();

    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseErrorSubscription?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
