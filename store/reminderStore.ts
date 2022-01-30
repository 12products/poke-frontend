import create from 'zustand'
import { Reminder } from '../types'

export type ReminderState = {
  reminders: Reminder[]
  updateReminders: (reminders: Reminder[]) => void
}
export const useReminderStore = create<ReminderState>((set) => ({
  reminders: [],
  updateReminders: (reminders) => set({ reminders }),
}))
