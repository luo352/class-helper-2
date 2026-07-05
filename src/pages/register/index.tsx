import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { register } from '@/services/user-service'
import { validateUsername, validatePassword, validateNickname } from '@/utils/crypto'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [className, setClassName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const usernameResult = validateUsername(username)
    if (!usernameResult.valid) {
      newErrors.username = usernameResult.message
    }

    const passwordResult = validatePassword(password)
    if (!passwordResult.valid) {
      newErrors.password = passwordResult.message
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    const nicknameResult = validateNickname(nickname)
    if (!nicknameResult.valid) {
      newErrors.nickname = nicknameResult.message
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      const result = await register({
        username,
        password,
        nickname,
        className
      })

      if (result.success) {
        Taro.showToast({ title: result.message, icon: 'success' })
        setTimeout(() => {
          if (process.env.TARO_ENV === 'h5') {
            window.location.href = '/#/pages/login/index'
          } else {
            Taro.redirectTo({ url: '/pages/login/index' })
          }
        }, 1500)
      } else {
        setErrors({ ...errors, submit: result.message })
        Taro.showToast({ title: result.message, icon: 'none' })
      }
    } catch (err) {
      console.error('[Register] handleRegister failed:', err)
      Taro.showToast({ title: '注册失败，请重试', icon: 'none' })
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
        <Text className={styles.title}>用户注册</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.loginCard}>
          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>用户名</Text>
            <Input
              className={`${styles.input} ${errors.username ? styles.error : ''}`}
              placeholder="请输入用户名（3-20位字母、数字、下划线）"
              value={username}
              onChange={(e) => {
                setUsername(e.detail.value)
                if (errors.username) {
                  setErrors({ ...errors, username: '' })
                }
              }}
              disabled={loading}
            />
            {errors.username && (
              <Text className={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>密码</Text>
            <Input
              className={`${styles.input} ${errors.password ? styles.error : ''}`}
              type="password"
              placeholder="请输入密码（6-50位，需包含字母和数字）"
              value={password}
              onChange={(e) => {
                setPassword(e.detail.value)
                if (errors.password) {
                  setErrors({ ...errors, password: '' })
                }
              }}
              disabled={loading}
            />
            {errors.password && (
              <Text className={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>确认密码</Text>
            <Input
              className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.detail.value)
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: '' })
                }
              }}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <Text className={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>昵称</Text>
            <Input
              className={`${styles.input} ${errors.nickname ? styles.error : ''}`}
              placeholder="请输入昵称（2-30位）"
              value={nickname}
              onChange={(e) => {
                setNickname(e.detail.value)
                if (errors.nickname) {
                  setErrors({ ...errors, nickname: '' })
                }
              }}
              disabled={loading}
            />
            {errors.nickname && (
              <Text className={styles.errorText}>{errors.nickname}</Text>
            )}
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>班级（选填）</Text>
            <Input
              className={styles.input}
              placeholder="请输入班级名称"
              value={className}
              onChange={(e) => setClassName(e.detail.value)}
              disabled={loading}
            />
          </View>

          {errors.submit && (
            <Text className={styles.errorText}>{errors.submit}</Text>
          )}

          <View className={`${styles.registerButton} ${loading ? styles.disabled : ''}`} onClick={handleRegister}>
            <Text>{loading ? '注册中...' : '注 册'}</Text>
          </View>

          <View className={styles.loginLink}>
            <Text className={styles.loginText}>已有账号？</Text>
            <Text className={styles.linkText} onClick={handleBack}>立即登录</Text>
          </View>
        </View>

        <View className={styles.tip}>
          <Text className={styles.tipText}>⚠️ 请妥善保管您的账号密码</Text>
        </View>
      </View>
    </View>
  )
}