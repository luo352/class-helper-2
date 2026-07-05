import React, { useState, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { setAdminInfo, isAdminLoggedIn, navigateToAdmin } from '@/utils/auth'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigateToAdmin()
    }
  }, [])

  const handleLogin = async () => {
    if (!username.trim()) {
      Taro.showToast({ title: '请输入用户名', icon: 'none' })
      return
    }
    if (!password.trim()) {
      Taro.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      if (username === 'admin' && password === 'admin123') {
        setAdminInfo({
          username,
          role: 'admin',
          loginTime: Date.now()
        })
        Taro.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          navigateToAdmin()
        }, 1500)
      } else {
        Taro.showToast({ title: '用户名或密码错误', icon: 'none' })
      }
    } catch (err) {
      console.error('[AdminLogin] handleLogin failed:', err)
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (process.env.TARO_ENV === 'h5') {
      window.location.href = '/#/pages/login/index'
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backButton} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <Text className={styles.title}>管理员登录</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.loginCard}>
          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>用户名</Text>
            <Input
              className={styles.input}
              placeholder="请输入管理员用户名"
              value={username}
              onChange={(e) => setUsername(e.detail.value)}
              disabled={loading}
            />
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>密码</Text>
            <Input
              className={styles.input}
              type="password"
              placeholder="请输入管理员密码"
              value={password}
              onChange={(e) => setPassword(e.detail.value)}
              disabled={loading}
            />
          </View>

          <View className={`${styles.loginButton} ${loading ? styles.disabled : ''}`} onClick={handleLogin}>
            <Text>{loading ? '登录中...' : '登 录'}</Text>
          </View>

          <View className={styles.tip}>
            <Text className={styles.tipText}>默认账号: admin</Text>
            <Text className={styles.tipText}>默认密码: admin123</Text>
          </View>
        </View>
      </View>
    </View>
  )
}