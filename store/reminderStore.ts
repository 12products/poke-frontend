import create from 'zustand'
import { Reminder } from '../types'

export type ReminderState = {
  reminders: Reminder[]
  updateReminders: (reminders: Reminder[]) => void
  addReminder: (reminder: Reminder) => void
  removeReminder: (reminder: Reminder) => void
}

export const useReminderStore = create<ReminderState>((set) => ({
  reminders: [],
  updateReminders: (reminders) => set({ reminders }),
  addReminder: (reminder) =>
    set((state) => ({ reminders: [...state.reminders, reminder] })),
  removeReminder: (reminder) =>
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== reminder.id),
    })),
}))
