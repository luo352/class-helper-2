import React, { useState, useEffect } from 'react'
import { View, Text, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

interface NotificationSettings {
  courseReminder: boolean
  attendanceNotification: boolean
  systemMessage: boolean
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    courseReminder: true,
    attendanceNotification: true,
    systemMessage: true
  })

  useEffect(() => {
    const saved = Taro.getStorageSync('notificationSettings')
    if (saved) {
      setSettings(saved)
    }
  }, [])

  const saveSettings = () => {
    Taro.setStorageSync('notificationSettings', settings)
    Taro.showToast({ title: '保存成功', icon: 'success' })
  }

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const notificationItems = [
    {
      key: 'courseReminder' as const,
      label: '课程提醒',
      desc: '接收课程开始前的提醒通知'
    },
    {
      key: 'attendanceNotification' as const,
      label: '考勤通知',
      desc: '接收考勤打卡结果通知'
    },
    {
      key: 'systemMessage' as const,
      label: '系统消息',
      desc: '接收系统公告和重要通知'
    }
  ]

  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.cardTitle}>通知设置</Text>
        {notificationItems.map(item => (
          <View key={item.key} className={styles.settingRow}>
            <View className={styles.settingLeft}>
              <Text className={styles.settingLabel}>{item.label}</Text>
              <Text className={styles.settingDesc}>{item.desc}</Text>
            </View>
            <Switch
              checked={settings[item.key]}
              onChange={(e) => updateSetting(item.key, e.detail.value)}
            />
          </View>
        ))}
      </View>

      <View className={styles.tip}>
        <Text className={styles.tipIcon}>💡</Text>
        <Text className={styles.tipText}>
          关闭通知后，你将不再收到相应类型的提醒消息。建议保持开启以获取及时的课程和考勤提醒。
        </Text>
      </View>

      <View className={styles.saveButton} onClick={saveSettings}>
        <Text>保存设置</Text>
      </View>
    </View>
  )
}