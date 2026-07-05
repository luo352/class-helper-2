import { callFunction } from './cloud'
import { Course } from '@/types'

export async function getCourses(dayOfWeek?: number): Promise<Course[]> {
  return callFunction<Course[]>('getCourses', { dayOfWeek })
}

export async function createCourse(data: Omit<Course, '_id' | '_openid' | 'createTime'>): Promise<Course> {
  return callFunction<Course>('createCourse', data)
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<{ success: boolean }> {
  return callFunction<{ success: boolean }>('updateCourse', { id, ...data })
}

export async function deleteCourse(id: string): Promise<{ success: boolean }> {
  return callFunction<{ success: boolean }>('deleteCourse', { id })
}
