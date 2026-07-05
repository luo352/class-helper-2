import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import { Course } from '@/types'
import { compareTime, formatTime } from '@/utils'

interface ActionCardProps {
  course: Course
  status: 'current' | 'upcoming' | 'ended'
  onClick?: () => void
}

export default function ActionCard({ course, status, onClick }: ActionCardProps) {
  const now = formatTime(new Date())
  const diff = compareTime(course.startTime, now)
  const minutesLeft = Math.floor(diff / 60)

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.statusBar}>
        <View className={`${styles.status} ${styles[status]}`}></View>
        <Text className={styles.statusText}>
          {status === 'current' && '正在上课'}
          {status === 'upcoming' && `距离上课还有 ${minutesLeft} 分钟`}
          {status === 'ended' && '已结束'}
        </Text>
      </View>
      
      <View className={styles.content}>
        <View className={styles.courseInfo}>
          <Text className={styles.courseName}>{course.courseName}</Text>
          <Text className={styles.teacher}>{course.teacher}</Text>
        </View>
        
        <View className={styles.timeInfo}>
          <Text className={styles.time}>{course.startTime} - {course.endTime}</Text>
          <Text className={styles.classroom}>{course.classroom}</Text>
        </View>
      </View>
      
      {status !== 'ended' && (
        <View className={styles.action}>
          <Text className={styles.navButton}>去教室</Text>
        </View>
      )}
    </View>
  )
}
