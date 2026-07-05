export interface User {
  _id?: string
  _openid: string
  username: string
  password?: string
  nickname: string
  avatar: string
  role: 'student' | 'admin'
  className?: string
  createTime?: string
  lastLoginTime?: string
  status: 'active' | 'inactive'
}

export interface LoginResult {
  openid: string
  userInfo?: User
  token?: string
}

export interface RegisterData {
  username: string
  password: string
  nickname: string
  className?: string
}

export interface UpdateProfileData {
  nickname?: string
  avatar?: string
  className?: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}
