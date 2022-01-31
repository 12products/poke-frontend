import { useEffect } from 'react'
import * as InAppPurchases from 'expo-in-app-purchases'
import shallow from 'zustand/shallow'

import { IAP_SKUs, PLATFORM_IAP_SKUs } from '../constants/iap'
import { useAuthStore, useIAPStore } from '../store'

function useIAP() {
  const { products, setProducts, isProcessing, setIsProcessing } = useIAPStore(
    (state) => ({
      products: state.products,
      setProducts: state.setProducts,
      isProcessing: state.isProcessing,
      setIsProcessing: state.setIsProcessing,
    }),
    shallow
  )
  const { setActivePlan } = useAuthStore()

  useEffect(() => {
    async function initializeIAP() {
      try {
        await InAppPurchases.connectAsync()
      } catch (e: any) {
        if (e?.message !== 'Already connected to App Store') {
          console.error('Failed to connect to app store')
          return
        }
      }

      try {
        const { results = [] } = await InAppPurchases.getProductsAsync(
          PLATFORM_IAP_SKUs || IAP_SKUs.ios
        )

        setProducts(results)
      } catch (e) {
        console.error('Failed to get products from the App Store: ', e)
      }
    }

    initializeIAP()

    // Listen to any purchases within the app
    InAppPurchases.setPurchaseListener(
      ({ responseCode, results, errorCode }) => {
        // A successful purchase was made
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          // We need to process and acknowledge each purchase
          results?.forEach(async (purchase) => {
            if (!purchase.acknowledged) {
              InAppPurchases.finishTransactionAsync(purchase, true)
            }

            if (purchase.purchaseState === 1) {
              setActivePlan(purchase.productId)
            }
          })
        } else if (
          responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED
        ) {
          console.log('User canceled the subscription purchase.')
        } else {
          console.error(
            `Something went wrong with the purchase. Received errorCode ${errorCode}`
          )
        }

        setIsProcessing(false)
      }
    )
  }, [])

  async function purchaseSubscription(product: InAppPurchases.IAPItemDetails) {
    if (isProcessing) return
    setIsProcessing(true)
    await InAppPurchases.purchaseItemAsync(product.productId)
  }

  return { products, isProcessing, purchaseSubscription }
}

export default useIAP
