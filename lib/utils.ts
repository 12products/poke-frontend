import { Platform } from 'react-native'

import { BRAND_COLORS } from '../constants'
import tailwindConfig from '../tailwind.config'
import { useReminderStore } from '../store'

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

export const getRandomBrandColor = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const idx = reminders.length
    ? reminders.length % BRAND_COLORS.length
    : Math.floor(Math.random() * BRAND_COLORS.length)
  BRAND_COLORS[idx]
}

export const getHexCodeForBrandColor = (color: string) =>
  // @ts-ignore
  tailwindConfig.theme.extend.colors[`brand-${color}`]
