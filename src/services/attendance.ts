import { callFunction } from './cloud'
import { Attendance, Leave } from '@/types'

export async function getAttendances(courseId?: string): Promise<Attendance[]> {
  return callFunction<Attendance[]>('getAttendances', { courseId })
}

export async function createAttendance(data: {
  courseId: string
  courseName: string
  type: 'checkin' | 'late' | 'absent'
}): Promise<Attendance> {
  return callFunction<Attendance>('createAttendance', data)
}

export async function getLeaves(status?: string): Promise<Leave[]> {
  return callFunction<Leave[]>('getLeaves', { status })
}

export async function createLeave(data: {
  courseId: string
  courseName: string
  reason: string
  startTime: string
  endTime: string
}): Promise<Leave> {
  return callFunction<Leave>('createLeave', data)
}
