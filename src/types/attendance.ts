export interface Attendance {
  _id?: string
  _openid: string
  courseId: string
  courseName: string
  type: 'checkin' | 'late' | 'absent'
  status: 'pending' | 'approved' | 'rejected'
  createTime?: string
}
