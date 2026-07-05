import React, { useState, useEffect } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { login } from '@/services/user-service'
import { validateUsername, validatePassword, sanitizeInput } from '@/utils/crypto'
import { navigateToHome } from '@/utils/auth'
import { isAuthenticated, getCurrentUser } from '@/services/user-service'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isAuthenticated()) {
      navigateToHome()
    }
  }, [])

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      navigateToHome()
    }
  }, [])

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

    if (!checked) {
      newErrors.privacy = '请先同意隐私协议'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      const sanitizedUsername = sanitizeInput(username)
      const sanitizedPassword = sanitizeInput(password)

      const result = await login(sanitizedUsername, sanitizedPassword)

      if (result.success) {
        Taro.showToast({ title: result.message, icon: 'success' })
        setTimeout(() => {
          navigateToHome()
        }, 1500)
      } else {
        setErrors({ ...errors, submit: result.message })
        Taro.showToast({ title: result.message, icon: 'none' })
      }
    } catch (err) {
      console.error('[LoginPage] handleLogin failed:', err)
      setErrors({ ...errors, submit: '登录失败，请重试' })
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = () => {
    if (process.env.TARO_ENV === 'h5') {
      window.location.href = '/#/pages/admin-login/index'
    } else {
      Taro.navigateTo({ url: '/pages/admin-login/index' })
    }
  }

  const handleRegister = () => {
    if (process.env.TARO_ENV === 'h5') {
      window.location.href = '/#/pages/register/index'
    } else {
      Taro.navigateTo({ url: '/pages/register/index' })
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.logo}>
          <Text className={styles.logoText}>📚</Text>
        </View>
        <Text className={styles.title}>班级助手</Text>
        <Text className={styles.subtitle}>智慧校园 · 便捷生活</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.loginCard}>
          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>用户名</Text>
            <Input
              className={`${styles.input} ${errors.username ? styles.error : ''}`}
              placeholder="请输入用户名"
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
              placeholder="请输入密码"
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

          {errors.submit && (
            <Text className={styles.errorText}>{errors.submit}</Text>
          )}

          <View className={`${styles.loginButton} ${loading ? styles.disabled : ''}`} onClick={handleLogin}>
            <Text>{loading ? '登录中...' : '登 录'}</Text>
          </View>

          <View className={styles.privacy}>
            <View className={`${styles.checkbox} ${checked ? styles.checked : ''}`} onClick={() => setChecked(!checked)}></View>
            <Text className={styles.privacyText}>
              我已阅读并同意
              <Text className={styles.privacyLink} onClick={() => setShowAgreement(true)}>《用户协议》</Text>
              和
              <Text className={styles.privacyLink} onClick={() => setShowAgreement(true)}>《隐私政策》</Text>
            </Text>
          </View>

          <View className={styles.extraLinks}>
            <Text className={styles.registerLink} onClick={handleRegister}>注册账号</Text>
            <Text className={styles.forgotPassword}>忘记密码？</Text>
          </View>
        </View>

        <View className={styles.adminEntry}>
          <Text className={styles.adminLink} onClick={handleAdminLogin}>👩‍💼 管理员入口</Text>
        </View>
      </View>

      {showAgreement && (
        <View className={styles.agreementModal} onClick={() => setShowAgreement(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>用户协议与隐私政策</Text>
              <Text className={styles.modalClose} onClick={() => setShowAgreement(false)}>×</Text>
            </View>
            <View className={styles.modalBody}>
              <Text>
                欢迎使用班级助手小程序！

                一、用户协议

                1. 服务条款

                班级助手（以下简称"本服务"）是由开发团队提供的一款面向学生的校园服务应用。用户在使用本服务前，应仔细阅读并理解本协议的全部内容。

                2. 用户账号

                用户通过注册账号登录使用本服务。用户应妥善保管自己的账号和密码，因账号泄露导致的损失由用户自行承担。

                3. 使用规范

                用户应遵守法律法规和学校规章制度，不得利用本服务从事违法违规活动。

                二、隐私政策

                1. 信息收集

                我们会收集用户的账号信息、昵称等基本信息，用于提供个性化服务。

                2. 信息使用

                用户信息仅用于本服务的正常运行和优化，不会泄露给第三方。

                3. 信息保护

                我们采取严格的安全措施保护用户信息，密码采用加密存储方式。

                三、其他

                本协议的最终解释权归班级助手开发团队所有。
              </Text>
            </View>
            <View className={styles.modalFooter}>
              <View className={styles.modalButton} onClick={() => setShowAgreement(false)}>
                <Text>我已阅读并同意</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}