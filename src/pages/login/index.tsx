import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { doLogin, setUserInfo, setOpenid, isLoggedIn } from '@/utils/auth'

export default function LoginPage() {
  const [checked, setChecked] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    if (isLoggedIn()) {
      Taro.switchTab({ url: '/pages/home/index' })
    }
  }, [])

  const handleLogin = async () => {
    if (!checked) {
      Taro.showToast({ title: '请先同意隐私协议', icon: 'none' })
      return
    }

    try {
      setLoading(true)
      const result = await doLogin()
      
      if (result.userInfo) {
        setUserInfo(result.userInfo)
        setOpenid(result.openid)
        
        Taro.showToast({ title: '登录成功', icon: 'success' })
        
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/home/index' })
        }, 1500)
      }
    } catch (err) {
      console.error('[LoginPage] handleLogin failed:', err)
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
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
          <View className={styles.loginButton} onClick={handleLogin} disabled={loading}>
            <Text className={styles.wxIcon}>👤</Text>
            <Text>{loading ? '登录中...' : '微信授权登录'}</Text>
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

                用户通过微信授权登录使用本服务。用户应妥善保管自己的微信账号，因账号泄露导致的损失由用户自行承担。

                3. 使用规范

                用户应遵守法律法规和学校规章制度，不得利用本服务从事违法违规活动。

                二、隐私政策

                1. 信息收集

                我们会收集用户的微信昵称、头像等基本信息，用于提供个性化服务。

                2. 信息使用

                用户信息仅用于本服务的正常运行和优化，不会泄露给第三方。

                3. 信息保护

                我们采取严格的安全措施保护用户信息，但不保证绝对安全。

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
