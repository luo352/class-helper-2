import React, { useState, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

interface UserProfile {
  nickname: string
  avatar: string
  className: string
  role: string
  signature: string
  studentId: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    nickname: '',
    avatar: '',
    className: '',
    role: '学生',
    signature: '',
    studentId: ''
  })

  useEffect(() => {
    const saved = Taro.getStorageSync('userProfile')
    if (saved) {
      setProfile(saved)
    }
  }, [])

  const saveProfile = () => {
    Taro.setStorageSync('userProfile', profile)
    Taro.showToast({ title: '保存成功', icon: 'success' })
  }

  const updateField = (key: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  const profileFields = [
    { key: 'nickname' as const, label: '昵称', placeholder: '请输入昵称' },
    { key: 'studentId' as const, label: '学号', placeholder: '请输入学号' },
    { key: 'className' as const, label: '班级', placeholder: '请输入班级' },
    { key: 'role' as const, label: '角色', placeholder: '请输入角色' },
    { key: 'signature' as const, label: '个性签名', placeholder: '请输入个性签名' }
  ]

  return (
    <View className={styles.page}>
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
              className={styles.input}
              value={profile[field.key]}
              placeholder={field.placeholder}
              onChange={(e) => updateField(field.key, e.detail.value)}
            />
          </View>
        ))}
      </View>

      <View className={styles.saveButton} onClick={saveProfile}>
        <Text>保存信息</Text>
      </View>
    </View>
  )
}