import Taro from '@tarojs/taro'
import { User, RegisterData, UpdateProfileData, ChangePasswordData } from '@/types'
import { hashPassword, generateSalt, generateToken } from '@/utils/crypto'

const USERS_KEY = 'classroom_users'
const SESSION_KEY = 'classroom_session'

interface StoredUser extends User {
  salt: string
}

function getUsers(): StoredUser[] {
  try {
    const data = Taro.getStorageSync(USERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]): void {
  Taro.setStorageSync(USERS_KEY, JSON.stringify(users))
}

function createDefaultUsers(): void {
  const existingUsers = getUsers()
  if (existingUsers.length === 0) {
    const defaultUsers: StoredUser[] = [
      {
        _id: '1',
        _openid: 'admin_openid',
        username: 'admin',
        nickname: '管理员',
        avatar: '',
        role: 'admin',
        className: '管理组',
        createTime: new Date().toISOString(),
        status: 'active',
        salt: generateSalt(),
        password: hashPassword('admin123', 'default_admin_salt_123')
      },
      {
        _id: '2',
        _openid: 'student_openid_1',
        username: 'student1',
        nickname: '张三',
        avatar: '',
        role: 'student',
        className: '计算机科学与技术2班',
        createTime: new Date().toISOString(),
        status: 'active',
        salt: 'default_student_salt_1',
        password: hashPassword('student123', 'default_student_salt_1')
      },
      {
        _id: '3',
        _openid: 'student_openid_2',
        username: 'student2',
        nickname: '李四',
        avatar: '',
        role: 'student',
        className: '计算机科学与技术2班',
        createTime: new Date().toISOString(),
        status: 'active',
        salt: 'default_student_salt_2',
        password: hashPassword('student123', 'default_student_salt_2')
      }
    ]
    saveUsers(defaultUsers)
  }
}

createDefaultUsers()

export interface LoginResult {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface RegisterResult {
  success: boolean
  message: string
  user?: User
}

export interface UpdateResult {
  success: boolean
  message: string
  user?: User
}

export interface PasswordResult {
  success: boolean
  message: string
}

export async function login(username: string, password: string): Promise<LoginResult> {
  await new Promise(resolve => setTimeout(resolve, 300))

  const users = getUsers()
  const user = users.find(u => u.username === username && u.status === 'active')

  if (!user) {
    return { success: false, message: '用户名不存在或账号已禁用' }
  }

  const hashedPassword = hashPassword(password, user.salt)
  if (hashedPassword !== user.password) {
    return { success: false, message: '密码错误' }
  }

  const token = generateToken()
  const userWithoutPassword: User = {
    _id: user._id,
    _openid: user._openid,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role,
    className: user.className,
    createTime: user.createTime,
    status: user.status
  }

  Taro.setStorageSync(SESSION_KEY, JSON.stringify({
    token,
    user: userWithoutPassword,
    loginTime: Date.now()
  }))

  const updatedUsers = users.map(u => {
    if (u._id === user._id) {
      return { ...u, lastLoginTime: new Date().toISOString() }
    }
    return u
  })
  saveUsers(updatedUsers)

  return {
    success: true,
    message: '登录成功',
    user: userWithoutPassword,
    token
  }
}

export async function register(data: RegisterData): Promise<RegisterResult> {
  await new Promise(resolve => setTimeout(resolve, 300))

  const users = getUsers()
  const existingUser = users.find(u => u.username === data.username)

  if (existingUser) {
    return { success: false, message: '用户名已存在' }
  }

  const salt = generateSalt()
  const hashedPassword = hashPassword(data.password, salt)

  const newUser: StoredUser = {
    _id: Date.now().toString(),
    _openid: 'user_openid_' + Date.now(),
    username: data.username,
    nickname: data.nickname,
    avatar: '',
    role: 'student',
    className: data.className || '未分配班级',
    createTime: new Date().toISOString(),
    status: 'active',
    salt,
    password: hashedPassword
  }

  users.push(newUser)
  saveUsers(users)

  const userWithoutPassword: User = {
    _id: newUser._id,
    _openid: newUser._openid,
    username: newUser.username,
    nickname: newUser.nickname,
    avatar: newUser.avatar,
    role: newUser.role,
    className: newUser.className,
    createTime: newUser.createTime,
    status: newUser.status
  }

  return {
    success: true,
    message: '注册成功',
    user: userWithoutPassword
  }
}

export async function updateProfile(userId: string, data: UpdateProfileData): Promise<UpdateResult> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const users = getUsers()
  const index = users.findIndex(u => u._id === userId)

  if (index === -1) {
    return { success: false, message: '用户不存在' }
  }

  users[index] = { ...users[index], ...data }
  saveUsers(users)

  const userWithoutPassword: User = {
    _id: users[index]._id,
    _openid: users[index]._openid,
    username: users[index].username,
    nickname: users[index].nickname,
    avatar: users[index].avatar,
    role: users[index].role,
    className: users[index].className,
    createTime: users[index].createTime,
    status: users[index].status
  }

  const session = getSession()
  if (session) {
    Taro.setStorageSync(SESSION_KEY, JSON.stringify({
      ...session,
      user: userWithoutPassword
    }))
  }

  return {
    success: true,
    message: '更新成功',
    user: userWithoutPassword
  }
}

export async function changePassword(userId: string, data: ChangePasswordData): Promise<PasswordResult> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const users = getUsers()
  const index = users.findIndex(u => u._id === userId)

  if (index === -1) {
    return { success: false, message: '用户不存在' }
  }

  const user = users[index]
  const hashedOldPassword = hashPassword(data.oldPassword, user.salt)

  if (hashedOldPassword !== user.password) {
    return { success: false, message: '原密码错误' }
  }

  const newSalt = generateSalt()
  const hashedNewPassword = hashPassword(data.newPassword, newSalt)

  users[index] = { ...users[index], salt: newSalt, password: hashedNewPassword }
  saveUsers(users)

  return {
    success: true,
    message: '密码修改成功'
  }
}

export async function logout(): Promise<void> {
  Taro.removeStorageSync(SESSION_KEY)
}

export async function deleteAccount(userId: string, password: string): Promise<PasswordResult> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const users = getUsers()
  const index = users.findIndex(u => u._id === userId)

  if (index === -1) {
    return { success: false, message: '用户不存在' }
  }

  const user = users[index]
  const hashedPassword = hashPassword(password, user.salt)

  if (hashedPassword !== user.password) {
    return { success: false, message: '密码错误' }
  }

  users[index] = { ...users[index], status: 'inactive' }
  saveUsers(users)

  await logout()

  return {
    success: true,
    message: '账号已注销'
  }
}

export interface SessionData {
  token: string
  user: User
  loginTime: number
}

export function getSession(): SessionData | null {
  try {
    const data = Taro.getStorageSync(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  const session = getSession()
  if (!session) return false

  const sessionAge = Date.now() - session.loginTime
  const maxAge = 24 * 60 * 60 * 1000
  return sessionAge < maxAge
}

export function getCurrentUser(): User | null {
  const session = getSession()
  if (!session || !isAuthenticated()) {
    return null
  }
  return session.user
}

export async function refreshSession(): Promise<boolean> {
  const session = getSession()
  if (!session) return false

  Taro.setStorageSync(SESSION_KEY, JSON.stringify({
    ...session,
    loginTime: Date.now()
  }))
  return true
}

export async function getUserList(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const users = getUsers()
  return users.map(u => ({
    _id: u._id,
    _openid: u._openid,
    username: u.username,
    nickname: u.nickname,
    avatar: u.avatar,
    role: u.role,
    className: u.className,
    createTime: u.createTime,
    status: u.status
  }))
}

export async function getUserById(userId: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const users = getUsers()
  const user = users.find(u => u._id === userId)

  if (!user) return null

  return {
    _id: user._id,
    _openid: user._openid,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role,
    className: user.className,
    createTime: user.createTime,
    status: user.status
  }
}