import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

export default function AboutPage() {
  const appInfo = {
    name: '班级助手',
    version: '2.0.0',
    description: '一款专为学生设计的课程管理与校园生活助手',
    features: [
      '📅 课程表管理',
      '📝 作业提醒',
      '📊 考勤打卡',
      '🗺️ 路线导航',
      '🎯 考试提醒'
    ],
    developer: '班级助手开发团队',
    contact: 'support@classhelper.com'
  }

  const openUserAgreement = () => {
    Taro.showModal({
      title: '用户协议',
      content: '用户协议内容：本应用仅供个人学习使用，不得用于商业用途。使用本应用即表示同意遵守相关条款。',
      showCancel: false
    })
  }

  const openPrivacyPolicy = () => {
    Taro.showModal({
      title: '隐私政策',
      content: '隐私政策内容：我们承诺不会收集、上传或分享你的任何个人数据。所有数据均存储在你的设备本地。',
      showCancel: false
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.logo}>
          <Text className={styles.logoIcon}>📚</Text>
        </View>
        <Text className={styles.appName}>{appInfo.name}</Text>
        <Text className={styles.appVersion}>版本 {appInfo.version}</Text>
        <Text className={styles.appDesc}>{appInfo.description}</Text>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>功能特色</Text>
        <View className={styles.featureList}>
          {appInfo.features.map((feature, index) => (
            <Text key={index} className={styles.featureItem}>{feature}</Text>
          ))}
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>关于我们</Text>
        <View className={styles.aboutItem}>
          <Text className={styles.aboutLabel}>开发团队</Text>
          <Text className={styles.aboutValue}>{appInfo.developer}</Text>
        </View>
        <View className={styles.aboutItem}>
          <Text className={styles.aboutLabel}>联系我们</Text>
          <Text className={styles.aboutValue}>{appInfo.contact}</Text>
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>相关协议</Text>
        <View className={styles.agreementRow} onClick={openUserAgreement}>
          <Text className={styles.agreementLabel}>用户协议</Text>
          <Text className={styles.agreementArrow}>›</Text>
        </View>
        <View className={styles.agreementRow} onClick={openPrivacyPolicy}>
          <Text className={styles.agreementLabel}>隐私政策</Text>
          <Text className={styles.agreementArrow}>›</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <Text className={styles.copyright}>© 2024 班级助手. All rights reserved.</Text>
      </View>
    </View>
  )
}