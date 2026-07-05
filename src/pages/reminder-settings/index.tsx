import React, { useState, useEffect } from 'react'
import { View, Text, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { requestSubscription } from '@/utils'

interface ReminderSettings {
  courseReminder: boolean
  courseReminderTime: number
  homeworkReminder: boolean
  homeworkReminderTime: number
  examReminder: boolean
  examReminderTime: number
  subscriptionEnabled: boolean
}

const timeOptions = [5, 10, 15, 30, 60]

export default function ReminderSettingsPage() {
  const [settings, setSettings] = useState<ReminderSettings>({
    courseReminder: true,
    courseReminderTime: 10,
    homeworkReminder: true,
    homeworkReminderTime: 30,
    examReminder: true,
    examReminderTime: 60,
    subscriptionEnabled: false
  })

  useEffect(() => {
    const saved = Taro.getStorageSync('reminderSettings')
    if (saved) {
      setSettings(saved)
    }
  }, [])

  const saveSettings = () => {
    Taro.setStorageSync('reminderSettings', settings)
    Taro.showToast({ title: '保存成功', icon: 'success' })
  }

  const updateSetting = (key: keyof ReminderSettings, value: boolean | number) => {
    if (key === 'subscriptionEnabled' && value === true) {
      handleSubscribe()
    } else {
      setSettings(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleSubscribe = async () => {
    const result = await requestSubscription()
    if (result) {
      setSettings(prev => ({ ...prev, subscriptionEnabled: true }))
      Taro.showToast({ title: '订阅成功', icon: 'success' })
    } else {
      Taro.showToast({ title: '订阅失败', icon: 'none' })
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.cardTitle}>课程提醒</Text>
        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingLabel}>开启课程提醒</Text>
            <Text className={styles.settingDesc}>上课前提醒你前往教室</Text>
          </View>
          <Switch
            checked={settings.courseReminder}
            onChange={(e) => updateSetting('courseReminder', e.detail.value)}
          />
        </View>
        {settings.courseReminder && (
          <View className={styles.settingRow}>
            <View className={styles.settingLeft}>
              <Text className={styles.settingLabel}>提前提醒时间</Text>
              <Text className={styles.settingDesc}>选择课程开始前多久提醒</Text>
            </View>
            <View className={styles.timeSelector}>
              {timeOptions.map(time => (
                <View
                  key={time}
                  className={`${styles.timeOption} ${settings.courseReminderTime === time ? styles.active : ''}`}
                  onClick={() => updateSetting('courseReminderTime', time)}
                >
                  <Text>{time}分钟</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>作业提醒</Text>
        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingLabel}>开启作业提醒</Text>
            <Text className={styles.settingDesc}>作业截止前提醒你提交</Text>
          </View>
          <Switch
            checked={settings.homeworkReminder}
            onChange={(e) => updateSetting('homeworkReminder', e.detail.value)}
          />
        </View>
        {settings.homeworkReminder && (
          <View className={styles.settingRow}>
            <View className={styles.settingLeft}>
              <Text className={styles.settingLabel}>提前提醒时间</Text>
              <Text className={styles.settingDesc}>选择作业截止前多久提醒</Text>
            </View>
            <View className={styles.timeSelector}>
              {timeOptions.map(time => (
                <View
                  key={time}
                  className={`${styles.timeOption} ${settings.homeworkReminderTime === time ? styles.active : ''}`}
                  onClick={() => updateSetting('homeworkReminderTime', time)}
                >
                  <Text>{time}分钟</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>考试提醒</Text>
        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingLabel}>开启考试提醒</Text>
            <Text className={styles.settingDesc}>考试前提醒你做好准备</Text>
          </View>
          <Switch
            checked={settings.examReminder}
            onChange={(e) => updateSetting('examReminder', e.detail.value)}
          />
        </View>
        {settings.examReminder && (
          <View className={styles.settingRow}>
            <View className={styles.settingLeft}>
              <Text className={styles.settingLabel}>提前提醒时间</Text>
              <Text className={styles.settingDesc}>选择考试开始前多久提醒</Text>
            </View>
            <View className={styles.timeSelector}>
              {timeOptions.map(time => (
                <View
                  key={time}
                  className={`${styles.timeOption} ${settings.examReminderTime === time ? styles.active : ''}`}
                  onClick={() => updateSetting('examReminderTime', time)}
                >
                  <Text>{time}分钟</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>推送通知</Text>
        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingLabel}>开启推送通知</Text>
            <Text className={styles.settingDesc}>应用关闭时也能收到课程提醒</Text>
          </View>
          <Switch
            checked={settings.subscriptionEnabled}
            onChange={(e) => updateSetting('subscriptionEnabled', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.tip}>
        <Text className={styles.tipIcon}>💡</Text>
        <Text className={styles.tipText}>
          开启推送通知后，即使应用关闭，你也能在微信收到课程提醒消息。
        </Text>
      </View>

      <View className={styles.saveButton} onClick={saveSettings}>
        <Text>保存设置</Text>
      </View>
    </View>
  )
}