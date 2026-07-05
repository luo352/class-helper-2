import React, { useState, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { getCurrentUser, updateProfile } from '@/services/user-service'
import { validateNickname } from '@/utils/crypto'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    nickname: '',
    className: '',
    avatar: '',
    role: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const user = getCurrentUser()
    if (user) {
      setProfile({
        nickname: user.nickname || '',
        className: user.className || '',
        avatar: user.avatar || '',
        role: user.role || ''
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const nicknameResult = validateNickname(profile.nickname)
    if (!nicknameResult.valid) {
      newErrors.nickname = nicknameResult.message
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    const user = getCurrentUser()
    if (!user || !user._id) {
      Taro.showToast({ title: '用户信息异常', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      const result = await updateProfile(user._id, {
        nickname: profile.nickname,
        className: profile.className
      })

      if (result.success) {
        Taro.showToast({ title: result.message, icon: 'success' })
        loadUserData()
      } else {
        Taro.showToast({ title: result.message, icon: 'none' })
      }
    } catch (err) {
      console.error('[Profile] handleSave failed:', err)
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (process.env.TARO_ENV === 'h5') {
      window.history.back()
    } else {
      Taro.navigateBack()
    }
  }

  const profileFields = [
    { key: 'nickname', label: '昵称', placeholder: '请输入昵称' },
    { key: 'className', label: '班级', placeholder: '请输入班级' }
  ]

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backButton} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <Text className={styles.title}>个人信息</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.avatarSection}>
          <View className={styles.avatar}>
            <Text className={styles.avatarIcon}>👤</Text>
          </View>
          <Text className={styles.nickname}>{profile.nickname || '点击编辑昵称'}</Text>
        </View>

        <View className={styles.card}>
          {profileFields.map(field => (
            <View key={field.key} className={styles.inputRow}>
              <Text className={styles.inputLabel}>{field.label}</Text>
              <Input
                className={`${styles.input} ${errors[field.key] ? styles.error : ''}`}
                value={profile[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => {
                  setProfile(prev => ({ ...prev, [field.key]: e.detail.value }))
                  if (errors[field.key]) {
                    setErrors({ ...errors, [field.key]: '' })
                  }
                }}
                disabled={loading}
              />
              {errors[field.key] && (
                <Text className={styles.errorText}>{errors[field.key]}</Text>
              )}
            </View>
          ))}

          <View className={styles.infoRow}>
            <Text className={styles.inputLabel}>用户名</Text>
            <Text className={styles.infoValue}>{getCurrentUser()?.username || '-'}</Text>
          </View>

          <View className={styles.infoRow}>
            <Text className={styles.inputLabel}>角色</Text>
            <Text className={styles.infoValue}>{profile.role === 'admin' ? '管理员' : '学生'}</Text>
          </View>
        </View>

        <View className={`${styles.saveButton} ${loading ? styles.disabled : ''}`} onClick={handleSave}>
          <Text>{loading ? '保存中...' : '保存信息'}</Text>
        </View>
      </View>
    </View>
  )
}