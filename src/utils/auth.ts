import Taro from '@tarojs/taro'
import { User, LoginResult } from '@/types'

const USER_KEY = 'classroom_user'
const OPENID_KEY = 'classroom_openid'

export function getUserInfo(): User | null {
  try {
    const data = Taro.getStorageSync(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setUserInfo(user: User): void {
  Taro.setStorageSync(USER_KEY, JSON.stringify(user))
}

export function getOpenid(): string | null {
  try {
    return Taro.getStorageSync(OPENID_KEY) || null
  } catch {
    return null
  }
}

export function setOpenid(openid: string): void {
  Taro.setStorageSync(OPENID_KEY, openid)
}

export function clearLoginState(): void {
  Taro.removeStorageSync(USER_KEY)
  Taro.removeStorageSync(OPENID_KEY)
}

export function isLoggedIn(): boolean {
  return !!getUserInfo() && !!getOpenid()
}

export async function checkLogin(): Promise<boolean> {
  if (isLoggedIn()) {
    return true
  }
  Taro.navigateTo({ url: '/pages/login/index' })
  return false
}

export async function doLogin(): Promise<LoginResult> {
  try {
    Taro.showLoading({ title: '登录中...' })
    
    const loginRes = await Taro.login()
    if (!loginRes.code) {
      throw new Error('登录失败')
    }

    const userProfileRes = await Taro.getUserProfile({
      desc: '用于完善会员资料'
    })

    Taro.hideLoading()
    return {
      openid: 'mock_openid_' + Date.now(),
      userInfo: {
        _openid: 'mock_openid_' + Date.now(),
        nickname: userProfileRes.userInfo.nickName,
        avatar: userProfileRes.userInfo.avatarUrl,
        role: 'student',
        className: '请完善班级信息'
      }
    }
  } catch (err) {
    Taro.hideLoading()
    console.error('[Auth] doLogin failed:', err)
    throw err
  }
}
