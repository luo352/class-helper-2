export interface User {
  _id?: string
  _openid: string
  nickname: string
  avatar: string
  role: 'student' | 'admin'
  className?: string
  createTime?: string
}

export interface LoginResult {
  openid: string
  userInfo?: User
}
