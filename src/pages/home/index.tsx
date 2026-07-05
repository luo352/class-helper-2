import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { Course, User } from '@/types'
import { getCourses } from '@/services/course'
import { getUserInfo } from '@/utils/auth'
import { formatTime, getDayOfWeek, compareTime, isTimeBetween, checkCourseReminder, showCourseReminder } from '@/utils'
import ActionCard from '@/components/ActionCard'
import CourseCard from '@/components/CourseCard'
import EmptyState from '@/components/EmptyState'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
  const [upcomingCourse, setUpcomingCourse] = useState<Course | null>(null)
  const [todayCourses, setTodayCourses] = useState<Course[]>([])

  useEffect(() => {
    loadUserData()
    loadCourses()
  }, [])

  const loadUserData = () => {
    const userInfo = getUserInfo()
    setUser(userInfo)
  }

  const loadCourses = async () => {
    try {
      const allCourses = await getCourses()
      setCourses(allCourses)
      processCourses(allCourses)
    } catch (err) {
      console.error('[HomePage] loadCourses:', err)
    }
  }

  const processCourses = (allCourses: Course[]) => {
    const today = getDayOfWeek(new Date())
    const now = formatTime(new Date())
    
    const todayList = allCourses
      .filter(c => c.dayOfWeek === today)
      .sort((a, b) => compareTime(a.startTime, b.startTime))
    setTodayCourses(todayList)

    const current = todayList.find(c => isTimeBetween(now, c.startTime, c.endTime))
    setCurrentCourse(current)

    if (!current) {
      const upcoming = todayList.find(c => compareTime(c.startTime, now) > 0)
      setUpcomingCourse(upcoming)
      
      if (upcoming) {
        const reminder = checkCourseReminder(upcoming)
        if (reminder.shouldRemind) {
          showCourseReminder(upcoming, reminder.minutesLeft)
        }
      }
    }
  }

  const getWeekDayLabel = (day: number) => {
    const labels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return labels[day]
  }

  const handleCourseClick = (course: Course) => {
    Taro.navigateTo({
      url: `/pages/course-detail/index?id=${course._id}`
    })
  }

  const handleNavClick = (course: Course) => {
    Taro.navigateTo({
      url: `/pages/route/index?classroom=${encodeURIComponent(course.classroom)}`
    })
  }

  const handleQuickAction = (type: string) => {
    const urls: Record<string, string> = {
      schedule: '/pages/schedule/index',
      attendance: '/pages/attendance/index',
      share: '/pages/share/index',
      leave: '/pages/leave-apply/index'
    }
    if (type === 'schedule') {
      Taro.switchTab({ url: urls[type] })
    } else {
      Taro.navigateTo({ url: urls[type] })
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.greeting}>
          <Text className={styles.welcome}>欢迎回来</Text>
          <Text className={styles.username}>{user?.nickname || '同学'}</Text>
        </View>
        <View className={styles.date}>
          <Text className={styles.day}>{new Date().getDate()}</Text>
          <Text className={styles.weekday}>{getWeekDayLabel(new Date().getDay())}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>今日行动</Text>
        {currentCourse ? (
          <ActionCard course={currentCourse} status="current" onClick={() => handleNavClick(currentCourse)} />
        ) : upcomingCourse ? (
          <ActionCard course={upcomingCourse} status="upcoming" onClick={() => handleNavClick(upcomingCourse)} />
        ) : todayCourses.length > 0 ? (
          <EmptyState title="今日课程已结束" description="好好休息，明天继续加油！" />
        ) : (
          <EmptyState title="今天没有课程" description="享受愉快的一天吧！" />
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>今日课表</Text>
        {todayCourses.length > 0 ? (
          <View className={styles.courseList}>
            {todayCourses.map(course => (
              <CourseCard key={course._id} course={course} onClick={() => handleCourseClick(course)} />
            ))}
          </View>
        ) : (
          <EmptyState title="暂无课程安排" description="可以在课表页面添加课程" />
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>快捷功能</Text>
        <View className={styles.quickActions}>
          <View className={styles.actionItem} onClick={() => handleQuickAction('schedule')}>
            <View className={styles.icon}>
              <Text className={styles.iconText}>📅</Text>
            </View>
            <Text className={styles.label}>课表</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('attendance')}>
            <View className={styles.icon}>
              <Text className={styles.iconText}>✓</Text>
            </View>
            <Text className={styles.label}>考勤</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('share')}>
            <View className={styles.icon}>
              <Text className={styles.iconText}>↗</Text>
            </View>
            <Text className={styles.label}>分享</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('leave')}>
            <View className={styles.icon}>
              <Text className={styles.iconText}>假</Text>
            </View>
            <Text className={styles.label}>请假</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
