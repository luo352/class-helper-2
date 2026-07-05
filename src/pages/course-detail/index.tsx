import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { Course } from '@/types'
import { getCourses } from '@/services/course'

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = (currentPage as any).$page?.options || {}
    loadCourse(options.id)
  }, [])

  const loadCourse = async (id?: string) => {
    try {
      const courses = await getCourses()
      const found = courses.find(c => c._id === id)
      setCourse(found || courses[0] || null)
    } catch (err) {
      console.error('[CourseDetailPage] loadCourse:', err)
    }
  }

  const handleNavigate = () => {
    if (course) {
      Taro.navigateTo({
        url: `/pages/route/index?classroom=${encodeURIComponent(course.classroom)}`
      })
    }
  }

  const getDayLabel = (day: number) => {
    const labels = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return labels[day] || ''
  }

  if (!course) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.courseCard}>
          <View className={styles.courseHeader}>
            <Text className={styles.courseName}>{course.courseName}</Text>
            <Text className={styles.courseCode}>{course.courseCode}</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.infoList}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>授课教师</Text>
              <Text className={styles.infoValue}>{course.teacher}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>上课地点</Text>
              <Text className={styles.infoValue}>{course.classroom}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>上课时间</Text>
              <Text className={styles.infoValue}>{getDayLabel(course.dayOfWeek)} {course.startTime} - {course.endTime}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>课程简介</Text>
          <Text style={{ fontSize: '28rpx', color: '#4E5969', lineHeight: '1.8' }}>
            本课程主要介绍{course.courseName}的基本概念、原理和应用。通过理论学习和实践操作，
            帮助学生掌握相关知识和技能，培养独立思考和解决问题的能力。
          </Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>课程安排</Text>
          <View style={{ display: 'flex', flexDirection: 'column', gap: '16rpx' }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#86909C' }}>课程周数</Text>
              <Text style={{ fontSize: '28rpx', color: '#1D2129' }}>第 1-16 周</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#86909C' }}>授课方式</Text>
              <Text style={{ fontSize: '28rpx', color: '#1D2129' }}>线下授课</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#86909C' }}>学分</Text>
              <Text style={{ fontSize: '28rpx', color: '#1D2129' }}>3 学分</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.actionButton}>
        <View className={styles.btn} onClick={handleNavigate}>
          <Text>导航去教室</Text>
        </View>
      </View>
    </View>
  )
}
