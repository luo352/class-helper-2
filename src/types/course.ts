export interface Course {
  _id?: string
  _openid: string
  courseCode: string
  courseName: string
  teacher: string
  classroom: string
  dayOfWeek: number
  startTime: string
  endTime: string
  color: string
  createTime?: string
}

export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const WEEK_DAYS: { value: WeekDay; label: string }[] = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' }
]

export const COURSE_COLORS = [
  '#4A90D9',
  '#67C23A',
  '#F56C6C',
  '#E6A23C',
  '#909399',
  '#B37FEB',
  '#EC5252'
]
