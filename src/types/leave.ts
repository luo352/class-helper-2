export interface Leave {
  _id?: string
  _openid: string
  courseId: string
  courseName: string
  reason: string
  startTime: string
  endTime: string
  status: 'pending' | 'approved' | 'rejected'
  createTime?: string
}
