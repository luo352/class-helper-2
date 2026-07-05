import { callFunction } from './cloud'
import { Reminder } from '@/types'

export async function getReminders(): Promise<Reminder[]> {
  return callFunction<Reminder[]>('getReminders')
}

export async function updateReminder(data: {
  type: 'course' | 'homework' | 'exam'
  enabled: boolean
  timeBefore: number
}): Promise<{ success: boolean }> {
  return callFunction<{ success: boolean }>('updateReminder', data)
}
