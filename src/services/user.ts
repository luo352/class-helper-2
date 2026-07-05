import { callFunction } from './cloud'
import { User, LoginResult } from '@/types'

export async function login(): Promise<LoginResult> {
  return callFunction<LoginResult>('login')
}

export async function getUser(openid: string): Promise<User> {
  return callFunction<User>('getUser', { openid })
}

export async function updateUser(data: Partial<User>): Promise<{ success: boolean }> {
  return callFunction<{ success: boolean }>('updateUser', data)
}
