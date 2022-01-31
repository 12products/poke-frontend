import create from 'zustand'
import * as InAppPurchases from 'expo-in-app-purchases'

export type IAPState = {
  products: InAppPurchases.IAPItemDetails[]
  setProducts: (products: InAppPurchases.IAPItemDetails[]) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
}

export const useIAPStore = create<IAPState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  isProcessing: false,
  setIsProcessing: (isProcessing) => set({ isProcessing }),
}))
