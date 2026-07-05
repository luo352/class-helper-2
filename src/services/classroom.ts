import { callFunction } from './cloud'
import { Classroom } from '@/types'

export async function getClassrooms(): Promise<Classroom[]> {
  return callFunction<Classroom[]>('getClassrooms')
}

export async function createClassroom(data: Omit<Classroom, '_id' | 'createTime'>): Promise<Classroom> {
  return callFunction<Classroom>('createClassroom', data)
}
