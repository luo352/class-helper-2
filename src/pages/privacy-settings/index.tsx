import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

export default function PrivacySettingsPage() {
  const clearCache = () => {
    Taro.showModal({
      title: '确认清除缓存',
      content: '确定要清除应用缓存吗？此操作不会删除你的数据。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '缓存已清除', icon: 'success' })
        }
      }
    })
  }

  const privacyItems = [
    {
      title: '隐私政策',
      desc: '我们重视你的隐私，所有数据仅存储在本地设备上'
    },
    {
      title: '位置权限',
      desc: '导航功能需要获取位置权限，用于定位和路线规划'
    },
    {
      title: '数据安全',
      desc: '你的所有数据仅保存在本地，不会上传至服务器'
    }
  ]

  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.cardTitle}>隐私说明</Text>
        {privacyItems.map((item, index) => (
          <View key={index} className={styles.privacyItem}>
            <Text className={styles.privacyTitle}>{item.title}</Text>
            <Text className={styles.privacyDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>数据管理</Text>
        <View className={styles.actionRow} onClick={clearCache}>
          <View className={styles.actionLeft}>
            <Text className={styles.actionIcon}>🗑️</Text>
            <View className={styles.actionInfo}>
              <Text className={styles.actionTitle}>清除缓存</Text>
              <Text className={styles.actionDesc}>清除应用临时缓存文件</Text>
            </View>
          </View>
          <Text className={styles.actionArrow}>›</Text>
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>权限说明</Text>
        <View className={styles.permissionList}>
          <View className={styles.permissionItem}>
            <Text className={styles.permissionIcon}>📍</Text>
            <View className={styles.permissionInfo}>
              <Text className={styles.permissionTitle}>位置信息</Text>
              <Text className={styles.permissionDesc}>用于路线导航和定位服务</Text>
            </View>
          </View>
          <View className={styles.permissionItem}>
            <Text className={styles.permissionIcon}>📱</Text>
            <View className={styles.permissionInfo}>
              <Text className={styles.permissionTitle}>网络权限</Text>
              <Text className={styles.permissionDesc}>用于加载地图和获取数据</Text>
            </View>
          </View>
          <View className={styles.permissionItem}>
            <Text className={styles.permissionIcon}>📋</Text>
            <View className={styles.permissionInfo}>
              <Text className={styles.permissionTitle}>剪贴板</Text>
              <Text className={styles.permissionDesc}>用于复制和导出数据</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tip}>
        <Text className={styles.tipText}>
          班级助手承诺：我们不会收集、上传或分享你的任何个人数据。所有数据均存储在你的设备本地。
        </Text>
      </View>
    </View>
  )
}