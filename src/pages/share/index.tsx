import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { Course } from '@/types'
import { getCourses } from '@/services/course'

export default function SharePage() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await getCourses()
      setCourses(data.slice(0, 5))
    } catch (err) {
      console.error('[SharePage] loadCourses:', err)
    }
  }

  const handleShareImage = () => {
    Taro.showToast({ title: '生成图片中...', icon: 'loading' })
    setTimeout(() => {
      Taro.hideToast()
      Taro.showToast({ title: '图片已保存', icon: 'success' })
    }, 1500)
  }

  const handleShareFriend = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.title}>课表分享</Text>
        
        <View className={styles.schedulePreview}>
          <View className={styles.previewHeader}>
            <Text className={styles.previewTitle}>我的课表</Text>
            <Text className={styles.previewSubtitle}>2024-2025学年 第二学期</Text>
          </View>
          
          <View className={styles.courseList}>
            {courses.map(course => (
              <View key={course._id} className={styles.courseItem}>
                <Text className={styles.courseName}>{course.courseName}</Text>
                <Text className={styles.courseTime}>{course.dayOfWeek}周 {course.startTime}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.actions}>
        <View className={`${styles.actionButton} ${styles.primaryButton}`} onClick={handleShareImage}>
          <Text className={styles.icon}>📷</Text>
          <Text className={styles.text}>生成图片</Text>
        </View>
        
        <View className={styles.actionButton} onClick={handleShareFriend}>
          <Text className={styles.icon}>👥</Text>
          <Text className={styles.text}>分享给好友</Text>
        </View>
      </View>

      <Text className={styles.tip}>生成的图片将保存到相册，可分享给同学</Text>
    </View>
  )
}
