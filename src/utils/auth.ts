import Taro from '@tarojs/taro'
import { User } from '@/types'
import { getSession, isAuthenticated, getCurrentUser, logout } from '@/services/user-service'

const USER_KEY = 'classroom_user'
const OPENID_KEY = 'classroom_openid'
const ADMIN_KEY = 'admin_login'

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
  logout()
}

export function isLoggedIn(): boolean {
  return isAuthenticated() || (!!getUserInfo() && !!getOpenid())
}

export async function checkLogin(): Promise<boolean> {
  if (isLoggedIn()) {
    return true
  }
  if (process.env.TARO_ENV === 'h5') {
    window.location.href = '/#/pages/login/index'
  } else {
    Taro.navigateTo({ url: '/pages/login/index' })
  }
  return false
}

export async function doLogin(): Promise<{ openid: string; userInfo?: User }> {
  try {
    Taro.showLoading({ title: '登录中...' })

    if (process.env.TARO_ENV === 'h5') {
      Taro.hideLoading()
      return {
        openid: 'h5_openid_' + Date.now(),
        userInfo: {
          _openid: 'h5_openid_' + Date.now(),
          username: 'h5_user',
          nickname: 'H5用户',
          avatar: '',
          role: 'student',
          className: '计算机科学与技术2班',
          status: 'active'
        }
      }
    }

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
        username: 'wx_user',
        nickname: userProfileRes.userInfo.nickName,
        avatar: userProfileRes.userInfo.avatarUrl,
        role: 'student',
        className: '请完善班级信息',
        status: 'active'
      }
    }
  } catch (err) {
    Taro.hideLoading()
    console.error('[Auth] doLogin failed:', err)
    throw err
  }
}

export function navigateToHome(): void {
  if (process.env.TARO_ENV === 'h5') {
    window.location.href = '/#/pages/home/index'
  } else {
    Taro.switchTab({ url: '/pages/home/index' })
  }
}

export interface AdminInfo {
  username: string
  role: 'admin'
  loginTime: number
}

export function getAdminInfo(): AdminInfo | null {
  try {
    const data = Taro.getStorageSync(ADMIN_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setAdminInfo(admin: AdminInfo): void {
  Taro.setStorageSync(ADMIN_KEY, JSON.stringify(admin))
}

export function clearAdminLogin(): void {
  Taro.removeStorageSync(ADMIN_KEY)
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminInfo()
}

export function navigateToAdmin(): void {
  if (process.env.TARO_ENV === 'h5') {
    window.location.href = '/#/pages/admin/index'
  } else {
    Taro.navigateTo({ url: '/pages/admin/index' })
  }
}

export function navigateToAdminLogin(): void {
  if (process.env.TARO_ENV === 'h5') {
    window.location.href = '/#/pages/admin-login/index'
  } else {
    Taro.navigateTo({ url: '/pages/admin-login/index' })
  }
}

export { getSession, isAuthenticated, getCurrentUser, logout } from '@/services/user-service'