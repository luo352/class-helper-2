import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { User } from '@/types'
import { clearLoginState } from '@/utils/auth'
import { getCurrentUser, deleteAccount } from '@/services/user-service'

export default function MinePage() {
  const [user, setUser] = useState<User | null>(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const userInfo = getCurrentUser()
    setUser(userInfo)
  }

  const menuItems = [
    { icon: '📅', text: '我的课表', badge: '' },
    { icon: '✓', text: '考勤记录', badge: '' },
    { icon: '假', text: '请假申请', badge: '1' },
    { icon: '🔔', text: '提醒设置', badge: '' },
    { icon: '↗', text: '课表分享', badge: '' },
    { icon: '💾', text: '数据备份', badge: '' }
  ]

  const settingItems = [
    { text: '个人信息', value: '' },
    { text: '修改密码', value: '' },
    { text: '通知设置', value: '' },
    { text: '隐私设置', value: '' },
    { text: '关于我们', value: '' },
    { text: '退出登录', value: '', isLogout: true },
    { text: '账号注销', value: '', isDelete: true }
  ]

  const handleMenuClick = (text: string) => {
    const urls: Record<string, string> = {
      '我的课表': '/pages/schedule/index',
      '考勤记录': '/pages/attendance/index',
      '请假申请': '/pages/leave-apply/index',
      '课表分享': '/pages/share/index',
      '提醒设置': '/pages/reminder-settings/index',
      '数据备份': '/pages/data-backup/index'
    }
    if (urls[text]) {
      if (text === '我的课表') {
        Taro.switchTab({ url: urls[text] })
      } else {
        Taro.navigateTo({ url: urls[text] })
      }
    } else {
      Taro.showToast({ title: `${text}功能开发中`, icon: 'none' })
    }
  }

  const handleSettingClick = (text: string, isLogout?: boolean, isDelete?: boolean) => {
    if (isLogout) {
      Taro.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            clearLoginState()
            Taro.showToast({ title: '已退出登录', icon: 'success' })
            setTimeout(() => {
              if (process.env.TARO_ENV === 'h5') {
                window.location.href = '/#/pages/login/index'
              } else {
                Taro.navigateTo({ url: '/pages/login/index' })
              }
            }, 1500)
          }
        }
      })
    } else if (isDelete) {
      setShowDeleteModal(true)
    } else {
      const urls: Record<string, string> = {
        '个人信息': '/pages/profile/index',
        '修改密码': '/pages/change-password/index',
        '通知设置': '/pages/notification-settings/index',
        '隐私设置': '/pages/privacy-settings/index',
        '关于我们': '/pages/about/index'
      }
      if (urls[text]) {
        Taro.navigateTo({ url: urls[text] })
      } else {
        Taro.showToast({ title: `${text}功能开发中`, icon: 'none' })
      }
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Taro.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    const currentUser = getCurrentUser()
    if (!currentUser || !currentUser._id) {
      Taro.showToast({ title: '用户信息异常', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      const result = await deleteAccount(currentUser._id, deletePassword)

      if (result.success) {
        Taro.showToast({ title: result.message, icon: 'success' })
        setShowDeleteModal(false)
        setDeletePassword('')
        setTimeout(() => {
          if (process.env.TARO_ENV === 'h5') {
            window.location.href = '/#/pages/login/index'
          } else {
            Taro.navigateTo({ url: '/pages/login/index' })
          }
        }, 1500)
      } else {
        Taro.showToast({ title: result.message, icon: 'none' })
      }
    } catch (err) {
      console.error('[Mine] handleDeleteAccount failed:', err)
      Taro.showToast({ title: '注销失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>{user?.nickname?.charAt(0) || '?'}</Text>
          </View>
          <View className={styles.userDetail}>
            <Text className={styles.nickname}>{user?.nickname || '用户'}</Text>
            <Text className={styles.className}>{user?.className || ''}</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>功能菜单</Text>
          </View>
          <View className={styles.menuList}>
            {menuItems.map((item, index) => (
              <View key={index} className={styles.menuItem} onClick={() => handleMenuClick(item.text)}>
                <View className={styles.menuLeft}>
                  <View className={styles.menuIcon}>
                    <Text className={styles.iconText}>{item.icon}</Text>
                  </View>
                  <Text className={styles.menuText}>{item.text}</Text>
                </View>
                <View className={styles.menuRight}>
                  {item.badge && <Text className={styles.badge}>{item.badge}</Text>}
                  <Text className={styles.arrow}>›</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>设置</Text>
          </View>
          {settingItems.map((item, index) => (
            <View 
              key={index} 
              className={`${styles.settingItem} ${item.isDelete ? styles.danger : ''}`} 
              onClick={() => handleSettingClick(item.text, item.isLogout, item.isDelete)}
            >
              <Text className={styles.settingText}>{item.text}</Text>
              <View className={styles.menuRight}>
                {item.value && <Text className={styles.settingValue}>{item.value}</Text>}
                {!item.isLogout && !item.isDelete && <Text className={styles.arrow}>›</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.footer}>
        <Text className={styles.version}>班级助手 v1.0.0</Text>
      </View>

      {showDeleteModal && (
        <View className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <View className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalTitle}>账号注销</View>
            <View className={styles.modalDesc}>
              <Text>⚠️ 注销后账号将无法恢复，请谨慎操作</Text>
            </View>
            <View className={styles.modalInputGroup}>
              <Text className={styles.modalLabel}>请输入密码确认注销</Text>
              <input 
                type="password"
                className={styles.modalInput}
                placeholder="请输入密码"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </View>
            <View className={styles.modalActions}>
              <View className={styles.modalCancel} onClick={() => setShowDeleteModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalConfirm} ${loading ? styles.disabled : ''}`} onClick={handleDeleteAccount}>
                <Text>{loading ? '处理中...' : '确认注销'}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}