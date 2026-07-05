import Taro from '@tarojs/taro'
import { Course } from '@/types'
import { compareTime, formatTime, getDayOfWeek } from './time'

export interface ReminderSettings {
  courseReminder: boolean
  courseReminderTime: number
  homeworkReminder: boolean
  homeworkReminderTime: number
  examReminder: boolean
  examReminderTime: number
  subscriptionEnabled: boolean
}

export interface NotificationSettings {
  courseReminder: boolean
  attendanceNotification: boolean
  systemMessage: boolean
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  courseReminder: true,
  courseReminderTime: 10,
  homeworkReminder: true,
  homeworkReminderTime: 30,
  examReminder: true,
  examReminderTime: 60,
  subscriptionEnabled: false
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  courseReminder: true,
  attendanceNotification: true,
  systemMessage: true
}

export function getReminderSettings(): ReminderSettings {
  const saved = Taro.getStorageSync('reminderSettings')
  return saved ? { ...DEFAULT_REMINDER_SETTINGS, ...saved } : DEFAULT_REMINDER_SETTINGS
}

export function saveReminderSettings(settings: ReminderSettings): void {
  Taro.setStorageSync('reminderSettings', settings)
}

export function getNotificationSettings(): NotificationSettings {
  const saved = Taro.getStorageSync('notificationSettings')
  return saved ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...saved } : DEFAULT_NOTIFICATION_SETTINGS
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  Taro.setStorageSync('notificationSettings', settings)
}

export function checkCourseReminder(course: Course): { shouldRemind: boolean; minutesLeft: number } {
  const settings = getReminderSettings()
  if (!settings.courseReminder) {
    return { shouldRemind: false, minutesLeft: 0 }
  }

  const today = new Date()
  const dayOfWeek = getDayOfWeek(today)
  
  if (course.dayOfWeek !== dayOfWeek) {
    return { shouldRemind: false, minutesLeft: 0 }
  }

  const now = formatTime(today)
  const diff = compareTime(course.startTime, now)
  
  if (diff > 0 && diff <= settings.courseReminderTime * 60) {
    return { shouldRemind: true, minutesLeft: Math.floor(diff / 60) }
  }

  return { shouldRemind: false, minutesLeft: 0 }
}

export function getUpcomingCourses(courses: Course[]): Course[] {
  const today = new Date()
  const dayOfWeek = getDayOfWeek(today)
  const now = formatTime(today)

  return courses
    .filter(c => c.dayOfWeek === dayOfWeek && compareTime(c.startTime, now) > 0)
    .sort((a, b) => compareTime(a.startTime, b.startTime))
}

export async function requestSubscription(): Promise<boolean> {
  return new Promise((resolve) => {
    Taro.requestSubscribeMessage({
      tmplIds: ['course_reminder_template'],
      success: (res) => {
        const result = res['course_reminder_template']
        resolve(result === 'accept')
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function showCourseReminder(course: Course, minutesLeft: number): void {
  Taro.showModal({
    title: '课程提醒',
    content: `距离「${course.courseName}」上课还有 ${minutesLeft} 分钟，教室：${course.classroom}`,
    confirmText: '去导航',
    cancelText: '知道了',
    success: (res) => {
      if (res.confirm) {
        Taro.navigateTo({
          url: `/pages/route/index?classroom=${encodeURIComponent(course.classroom)}`
        })
      }
    }
  })
}

export function showToastReminder(title: string): void {
  Taro.showToast({
    title,
    icon: 'none',
    duration: 3000
  })
}