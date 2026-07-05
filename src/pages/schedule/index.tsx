import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { Course, WEEK_DAYS } from '@/types'
import { getCourses } from '@/services/course'
import { compareTime, getDayOfWeek, getWeekDays, getWeekNumber } from '@/utils'
import CourseCard from '@/components/CourseCard'
import EmptyState from '@/components/EmptyState'

type ViewMode = 'week' | 'day'

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedDay, setSelectedDay] = useState(getDayOfWeek(new Date()))
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date()
    const currentDay = today.getDay() || 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1)
    return monday
  })

  useEffect(() => {
    loadCourses()
    updateWeekDays()
  }, [currentWeekStart])

  const loadCourses = async () => {
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (err) {
      console.error('[SchedulePage] loadCourses:', err)
    }
  }

  const updateWeekDays = () => {
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      days.push(date)
    }
    setWeekDays(days)
  }

  const getDayCourses = (dayOfWeek: number) => {
    return courses
      .filter(c => c.dayOfWeek === dayOfWeek)
      .sort((a, b) => compareTime(a.startTime, b.startTime))
  }

  const getCourseTop = (startTime: string): number => {
    const timeSlots = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30']
    const index = timeSlots.findIndex(t => t <= startTime)
    return index >= 0 ? index * 120 : 0
  }

  const getCourseHeight = (startTime: string, endTime: string): number => {
    const timeSlots = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30']
    const startIndex = timeSlots.findIndex(t => t <= startTime)
    const endIndex = timeSlots.findIndex(t => t >= endTime)
    if (startIndex >= 0 && endIndex >= 0) {
      return (endIndex - startIndex + 1) * 120 - 8
    }
    return 232
  }

  const timeSlots = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30']

  const isToday = (dayOfWeek: number) => {
    const today = new Date()
    const weekStartOfToday = new Date(today)
    const currentDay = today.getDay() || 7
    weekStartOfToday.setDate(today.getDate() - currentDay + 1)
    return dayOfWeek === getDayOfWeek(today) && 
           currentWeekStart.toDateString() === weekStartOfToday.toDateString()
  }

  const handleCourseClick = (course: Course) => {
    Taro.navigateTo({
      url: `/pages/course-detail/index?id=${course._id}`
    })
  }

  const handleAddCourse = () => {
    Taro.showToast({ title: '请在管理端添加课程', icon: 'none' })
  }

  const handlePrevWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  const handleGoToday = () => {
    const today = new Date()
    const currentDay = today.getDay() || 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1)
    setCurrentWeekStart(monday)
    setSelectedDay(getDayOfWeek(today))
    setViewMode('day')
  }

  const handleDayClick = (dayOfWeek: number) => {
    setSelectedDay(dayOfWeek)
  }

  const getCurrentWeekNumber = () => {
    return getWeekNumber(currentWeekStart)
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.viewSwitch}>
          <View className={`${styles.switchItem} ${viewMode === 'week' ? styles.active : ''}`} onClick={() => setViewMode('week')}>
            <Text>周视图</Text>
          </View>
          <View className={`${styles.switchItem} ${viewMode === 'day' ? styles.active : ''}`} onClick={() => setViewMode('day')}>
            <Text>日视图</Text>
          </View>
        </View>

        <View className={styles.weekNav}>
          <View className={styles.weekButton} onClick={handlePrevWeek}>
            <Text>‹</Text>
          </View>
          <View className={styles.weekInfo}>
            <Text className={styles.weekTitle}>第 {getCurrentWeekNumber()} 周</Text>
            <Text className={styles.weekDate}>
              {weekDays[0]?.getMonth() + 1}月{weekDays[0]?.getDate()}日 - {weekDays[6]?.getMonth() + 1}月{weekDays[6]?.getDate()}日
            </Text>
          </View>
          <View className={styles.weekButton} onClick={handleNextWeek}>
            <Text>›</Text>
          </View>
        </View>

        <View className={styles.dayTabs}>
          {WEEK_DAYS.map(day => (
            <View
              key={day.value}
              className={`${styles.dayTab} ${selectedDay === day.value ? styles.active : ''} ${isToday(day.value) ? styles.today : ''}`}
              onClick={() => handleDayClick(day.value)}
            >
              <Text className={styles.dayLabel}>{day.label.slice(1)}</Text>
              <Text className={styles.dayNum}>{weekDays[day.value - 1]?.getDate() || ''}</Text>
            </View>
          ))}
        </View>

        {viewMode === 'day' && (
          <View className={styles.todayButton} onClick={handleGoToday}>
            <Text>回到今天</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        {viewMode === 'week' ? (
          <View className={styles.timeline}>
            <View className={styles.timeSlots}>
              {timeSlots.map((time, index) => (
                <View key={time} className={styles.timeSlot}>
                  <Text className={styles.timeLabel}>{time}</Text>
                </View>
              ))}
            </View>
            <View className={styles.courseArea}>
              {courses.map(course => (
                <View
                  key={course._id}
                  className={styles.courseBlock}
                  style={{
                    top: `${getCourseTop(course.startTime)}rpx`,
                    height: `${getCourseHeight(course.startTime, course.endTime)}rpx`,
                    borderLeftColor: course.color
                  }}
                  onClick={() => handleCourseClick(course)}
                >
                  <Text className={styles.courseName}>{course.courseName}</Text>
                  <Text className={styles.courseMeta}>{course.classroom} | {course.teacher}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className={styles.dayView}>
            {getDayCourses(selectedDay).length > 0 ? (
              getDayCourses(selectedDay).map(course => (
                <CourseCard key={course._id} course={course} onClick={() => handleCourseClick(course)} />
              ))
            ) : (
              <EmptyState title="当天没有课程" description="好好休息一下吧" />
            )}
          </View>
        )}
      </View>

      <View className={styles.addButton} onClick={handleAddCourse}>
        <Text className={styles.addIcon}>+</Text>
      </View>
    </View>
  )
}