import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { isAdminLoggedIn, clearAdminLogin, navigateToAdminLogin } from '@/utils/auth'

interface UserItem {
  id: string
  nickname: string
  className: string
  role: 'student' | 'admin'
  status: 'active' | 'inactive'
  lastLogin?: string
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  todayCheckins: number
  pendingLeaves: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    todayCheckins: 0,
    pendingLeaves: 0
  })
  const [users, setUsers] = useState<UserItem[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'attendance' | 'system'>('users')

  useEffect(() => {
    checkAdminAuth()
    loadStats()
    loadUsers()
  }, [])

  const checkAdminAuth = () => {
    if (!isAdminLoggedIn()) {
      setTimeout(() => {
        navigateToAdminLogin()
      }, 100)
    }
  }

  const loadStats = () => {
    setStats({
      totalUsers: 128,
      activeUsers: 112,
      todayCheckins: 89,
      pendingLeaves: 5
    })
  }

  const loadUsers = () => {
    setUsers([
      { id: '1', nickname: '张三', className: '计算机科学与技术2班', role: 'student', status: 'active', lastLogin: '2024-01-15 08:30' },
      { id: '2', nickname: '李四', className: '计算机科学与技术2班', role: 'student', status: 'active', lastLogin: '2024-01-15 09:15' },
      { id: '3', nickname: '王五', className: '软件工程1班', role: 'student', status: 'inactive', lastLogin: '2024-01-14 16:20' },
      { id: '4', nickname: '赵六', className: '网络工程3班', role: 'student', status: 'active', lastLogin: '2024-01-15 10:00' },
      { id: '5', nickname: '孙七', className: '计算机科学与技术2班', role: 'admin', status: 'active', lastLogin: '2024-01-15 07:30' },
    ])
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出管理员登录吗？',
      success: (res) => {
        if (res.confirm) {
          clearAdminLogin()
          Taro.showToast({ title: '已退出', icon: 'success' })
          setTimeout(() => {
            if (process.env.TARO_ENV === 'h5') {
              window.location.href = '/#/pages/login/index'
            } else {
              Taro.redirectTo({ url: '/pages/login/index' })
            }
          }, 1500)
        }
      }
    })
  }

  const handleMenuClick = (type: string) => {
    switch (type) {
      case '用户管理':
        setActiveTab('users')
        break
      case '课程管理':
        setActiveTab('courses')
        break
      case '考勤管理':
        setActiveTab('attendance')
        break
      case '系统设置':
        setActiveTab('system')
        break
    }
  }

  const menuItems = [
    { icon: '👥', text: '用户管理', badge: stats.totalUsers.toString() },
    { icon: '📅', text: '课程管理', badge: '24' },
    { icon: '✓', text: '考勤管理', badge: stats.todayCheckins.toString() },
    { icon: '⚙️', text: '系统设置', badge: '' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <View className={styles.content}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>用户列表</Text>
              <Text className={styles.sectionAction}>添加用户</Text>
            </View>
            <View className={styles.userList}>
              {users.map((user) => (
                <View key={user.id} className={styles.userItem}>
                  <View className={styles.userAvatar}>
                    <Text className={styles.avatarText}>{user.nickname.charAt(0)}</Text>
                  </View>
                  <View className={styles.userInfo}>
                    <Text className={styles.userName}>{user.nickname}</Text>
                    <Text className={styles.userClass}>{user.className}</Text>
                  </View>
                  <View className={styles.userStatus}>
                    <Text className={`${styles.statusBadge} ${user.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                      {user.status === 'active' ? '正常' : '停用'}
                    </Text>
                    <Text className={styles.roleBadge}>{user.role === 'admin' ? '管理员' : '学生'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )
      case 'courses':
        return (
          <View className={styles.content}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>课程管理</Text>
              <Text className={styles.sectionAction}>添加课程</Text>
            </View>
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📚</Text>
              <Text className={styles.emptyText}>课程管理功能开发中</Text>
            </View>
          </View>
        )
      case 'attendance':
        return (
          <View className={styles.content}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>考勤管理</Text>
              <Text className={styles.sectionAction}>查看详情</Text>
            </View>
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>✓</Text>
              <Text className={styles.emptyText}>考勤管理功能开发中</Text>
            </View>
          </View>
        )
      case 'system':
        return (
          <View className={styles.content}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>系统设置</Text>
            </View>
            <View className={styles.settingList}>
              <View className={styles.settingItem}>
                <Text className={styles.settingText}>系统版本</Text>
                <Text className={styles.settingValue}>v2.0.0</Text>
              </View>
              <View className={styles.settingItem}>
                <Text className={styles.settingText}>服务器状态</Text>
                <Text className={`${styles.settingValue} ${styles.statusOnline}`}>在线</Text>
              </View>
              <View className={styles.settingItem}>
                <Text className={styles.settingText}>数据备份</Text>
                <Text className={styles.settingArrow}>›</Text>
              </View>
              <View className={styles.settingItem}>
                <Text className={styles.settingText}>日志查看</Text>
                <Text className={styles.settingArrow}>›</Text>
              </View>
              <View className={styles.settingItem} onClick={handleLogout}>
                <Text className={`${styles.settingText} ${styles.logout}`}>退出登录</Text>
              </View>
            </View>
          </View>
        )
      default:
        return null
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>管理员后台</Text>
        <View className={styles.logoutButton} onClick={handleLogout}>
          <Text className={styles.logoutIcon}>↪</Text>
        </View>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.totalUsers}</Text>
          <Text className={styles.statLabel}>总用户</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.activeUsers}</Text>
          <Text className={styles.statLabel}>活跃用户</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.todayCheckins}</Text>
          <Text className={styles.statLabel}>今日签到</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.pendingLeaves}</Text>
          <Text className={styles.statLabel}>待审核</Text>
        </View>
      </View>

      <View className={styles.menu}>
        {menuItems.map((item, index) => (
          <View key={index} className={`${styles.menuItem} ${activeTab === ['users', 'courses', 'attendance', 'system'][index] ? styles.active : ''}`} onClick={() => handleMenuClick(item.text)}>
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <Text className={styles.menuText}>{item.text}</Text>
            {item.badge && (
              <View className={styles.menuBadge}>
                <Text className={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {renderContent()}
    </View>
  )
}