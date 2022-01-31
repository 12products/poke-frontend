import { Platform } from 'react-native'

export const IAP_SKUs = {
  ios: ['monthly'],
  android: [],
}

export const PLATFORM_IAP_SKUs = Platform.select(IAP_SKUs)
