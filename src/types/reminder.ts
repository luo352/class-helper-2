export interface Reminder {
  _id?: string
  _openid: string
  type: 'course' | 'homework' | 'exam'
  enabled: boolean
  timeBefore: number
  createTime?: string
}
