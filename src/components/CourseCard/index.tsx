import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import { Course } from '@/types'

interface CourseCardProps {
  course: Course
  onClick?: () => void
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <View className={styles.card} style={{ borderLeftColor: course.color }} onClick={onClick}>
      <View className={styles.header}>
        <Text className={styles.courseName}>{course.courseName}</Text>
        <Text className={styles.courseCode}>{course.courseCode}</Text>
      </View>
      <View className={styles.info}>
        <View className={styles.item}>
          <Text className={styles.label}>教师</Text>
          <Text className={styles.value}>{course.teacher}</Text>
        </View>
        <View className={styles.item}>
          <Text className={styles.label}>教室</Text>
          <Text className={styles.value}>{course.classroom}</Text>
        </View>
        <View className={styles.item}>
          <Text className={styles.label}>时间</Text>
          <Text className={styles.value}>{course.startTime} - {course.endTime}</Text>
        </View>
      </View>
    </View>
  )
}
