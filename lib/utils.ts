import { Platform } from 'react-native'

import { BRAND_COLORS } from '../constants'
import tailwindConfig from '../tailwind.config'

export const isBrowser = () => Platform.OS === 'web'

export const numToDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const getRandomBrandColor = (): string => {
  return BRAND_COLORS[(Math.random() * BRAND_COLORS.length) | 0]
}

export const getHexCodeForBrandColor = (color: string) =>
  // @ts-ignore
  tailwindConfig.theme.extend.colors[`brand-${color}`]
