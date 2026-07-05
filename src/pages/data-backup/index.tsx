import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

interface UserData {
  courses: any[]
  homework: any[]
  exams: any[]
  attendance: any[]
  reminders: any[]
  profile: any
}

export default function DataBackupPage() {
  const [userData, setUserData] = useState<UserData>({
    courses: [],
    homework: [],
    exams: [],
    attendance: [],
    reminders: [],
    profile: {}
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const data: UserData = {
      courses: Taro.getStorageSync('courses') || [],
      homework: Taro.getStorageSync('homework') || [],
      exams: Taro.getStorageSync('exams') || [],
      attendance: Taro.getStorageSync('attendance') || [],
      reminders: Taro.getStorageSync('reminderSettings') || {},
      profile: Taro.getStorageSync('userProfile') || {}
    }
    setUserData(data)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    Taro.setClipboardData({
      data: dataStr,
      success: () => {
        Taro.showToast({ title: '数据已复制到剪贴板', icon: 'success' })
      },
      fail: () => {
        Taro.showToast({ title: '复制失败', icon: 'none' })
      }
    })
  }

  const clearData = () => {
    Taro.showModal({
      title: '确认清除',
      content: '确定要清除所有本地数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('courses')
          Taro.removeStorageSync('homework')
          Taro.removeStorageSync('exams')
          Taro.removeStorageSync('attendance')
          Taro.removeStorageSync('reminderSettings')
          Taro.removeStorageSync('userProfile')
          loadUserData()
          Taro.showToast({ title: '数据已清除', icon: 'success' })
        }
      }
    })
  }

  const getDataSize = () => {
    const jsonStr = JSON.stringify(userData)
    const bytes = new Blob([jsonStr]).size
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`
    } else {
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    }
  }

  const stats = [
    { label: '课程数量', value: userData.courses.length },
    { label: '作业数量', value: userData.homework.length },
    { label: '考试数量', value: userData.exams.length },
    { label: '考勤记录', value: userData.attendance.length },
    { label: '数据大小', value: getDataSize() }
  ]

  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.cardTitle}>数据概览</Text>
        <View className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} className={styles.statItem}>
              <Text className={styles.statValue}>{stat.value}</Text>
              <Text className={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>数据预览</Text>
        <View className={styles.dataPreview}>
          <Text className={styles.previewText}>
            {JSON.stringify(userData, null, 2)}
          </Text>
        </View>
      </View>

      <View className={styles.buttonGroup}>
        <View className={styles.actionButton} onClick={exportData}>
          <Text className={styles.buttonIcon}>📋</Text>
          <Text>导出数据</Text>
        </View>
        <View className={`${styles.actionButton} ${styles.danger}`} onClick={clearData}>
          <Text className={styles.buttonIcon}>🗑️</Text>
          <Text>清除数据</Text>
        </View>
      </View>

      <View className={styles.tip}>
        <Text className={styles.tipIcon}>💡</Text>
        <Text className={styles.tipText}>
          建议定期导出数据备份，以防数据丢失。导出的数据可保存到云盘或其他存储位置。
        </Text>
      </View>
    </View>
  )
}