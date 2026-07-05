import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { changePassword } from '@/services/user-service'
import { getCurrentUser } from '@/services/user-service'
import { validatePassword } from '@/utils/crypto'

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!oldPassword) {
      newErrors.oldPassword = '请输入原密码'
    }

    const newPasswordResult = validatePassword(newPassword)
    if (!newPasswordResult.valid) {
      newErrors.newPassword = newPasswordResult.message
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validateForm()) return

    const user = getCurrentUser()
    if (!user || !user._id) {
      Taro.showToast({ title: '用户信息异常', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      const result = await changePassword(user._id, {
        oldPassword,
        newPassword
      })

      if (result.success) {
        Taro.showToast({ title: result.message, icon: 'success' })
        setTimeout(() => {
          if (process.env.TARO_ENV === 'h5') {
            window.history.back()
          } else {
            Taro.navigateBack()
          }
        }, 1500)
      } else {
        setErrors({ ...errors, submit: result.message })
        Taro.showToast({ title: result.message, icon: 'none' })
      }
    } catch (err) {
      console.error('[ChangePassword] handleChangePassword failed:', err)
      Taro.showToast({ title: '修改失败，请重试', icon: 'none' })
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

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backButton} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <Text className={styles.title}>修改密码</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>原密码</Text>
            <Input
              className={`${styles.input} ${errors.oldPassword ? styles.error : ''}`}
              type="password"
              placeholder="请输入原密码"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.detail.value)
                if (errors.oldPassword) {
                  setErrors({ ...errors, oldPassword: '' })
                }
              }}
              disabled={loading}
            />
            {errors.oldPassword && (
              <Text className={styles.errorText}>{errors.oldPassword}</Text>
            )}
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>新密码</Text>
            <Input
              className={`${styles.input} ${errors.newPassword ? styles.error : ''}`}
              type="password"
              placeholder="请输入新密码（6-50位，需包含字母和数字）"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.detail.value)
                if (errors.newPassword) {
                  setErrors({ ...errors, newPassword: '' })
                }
              }}
              disabled={loading}
            />
            {errors.newPassword && (
              <Text className={styles.errorText}>{errors.newPassword}</Text>
            )}
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>确认密码</Text>
            <Input
              className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
              type="password"
              placeholder="请再次输入新密码"
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

          {errors.submit && (
            <Text className={styles.errorText}>{errors.submit}</Text>
          )}

          <View className={`${styles.submitButton} ${loading ? styles.disabled : ''}`} onClick={handleChangePassword}>
            <Text>{loading ? '修改中...' : '确认修改'}</Text>
          </View>
        </View>

        <View className={styles.tip}>
          <Text className={styles.tipText}>⚠️ 修改密码后请使用新密码登录</Text>
        </View>
      </View>
    </View>
  )
}