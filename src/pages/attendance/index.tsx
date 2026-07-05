import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { Attendance, Leave } from '@/types'
import { getAttendances, getLeaves, createAttendance } from '@/services/attendance'
import EmptyState from '@/components/EmptyState'

type TabType = 'checkin' | 'leave'

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('checkin')
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [stats, setStats] = useState({ total: 0, attended: 0, late: 0, absent: 0 })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      if (activeTab === 'checkin') {
        const data = await getAttendances()
        setAttendances(data)
        calculateStats(data)
      } else {
        const data = await getLeaves()
        setLeaves(data)
      }
    } catch (err) {
      console.error('[AttendancePage] loadData:', err)
    }
  }

  const calculateStats = (data: Attendance[]) => {
    const total = data.length
    const attended = data.filter(a => a.type === 'checkin' && a.status === 'approved').length
    const late = data.filter(a => a.type === 'late').length
    const absent = data.filter(a => a.type === 'absent').length
    setStats({ total, attended, late, absent })
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { checkin: '正常签到', late: '迟到', absent: '缺勤' }
    return labels[type] || type
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = { approved: '已通过', pending: '待审核', rejected: '已拒绝' }
    return labels[status] || status
  }

  const handleCheckin = async () => {
    try {
      Taro.showLoading({ title: '签到中...' })
      await createAttendance({
        courseId: 'course_1',
        courseName: '高等数学',
        type: 'checkin'
      })
      Taro.hideLoading()
      Taro.showToast({ title: '签到成功', icon: 'success' })
      loadData()
    } catch (err) {
      Taro.hideLoading()
      console.error('[AttendancePage] handleCheckin:', err)
      Taro.showToast({ title: '签到失败', icon: 'none' })
    }
  }

  const handleApplyLeave = () => {
    Taro.navigateTo({ url: '/pages/leave-apply/index' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>总考勤</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.attended}</Text>
            <Text className={styles.statLabel}>正常</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.late}</Text>
            <Text className={styles.statLabel}>迟到</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.absent}</Text>
            <Text className={styles.statLabel}>缺勤</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.tabHeader}>
          <View className={`${styles.tabItem} ${activeTab === 'checkin' ? styles.active : ''}`} onClick={() => setActiveTab('checkin')}>
            <Text>考勤记录</Text>
          </View>
          <View className={`${styles.tabItem} ${activeTab === 'leave' ? styles.active : ''}`} onClick={() => setActiveTab('leave')}>
            <Text>请假记录</Text>
          </View>
        </View>

        {activeTab === 'checkin' && (
          <>
            <View className={styles.checkinButton} onClick={handleCheckin}>
              <Text>立即签到</Text>
            </View>
            
            {attendances.length > 0 ? (
              <View className={styles.attendanceList}>
                {attendances.map(item => (
                  <View key={item._id} className={styles.attendanceItem}>
                    <View className={styles.attendanceHeader}>
                      <Text className={styles.courseName}>{item.courseName}</Text>
                      <Text className={`${styles.typeBadge} ${styles[item.type]}`}>{getTypeLabel(item.type)}</Text>
                    </View>
                    <View className={styles.attendanceTime}>
                      <Text>{item.createTime}</Text>
                      <Text className={`${styles.statusBadge} ${styles[item.status]}`} style={{ marginLeft: '16rpx' }}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState title="暂无考勤记录" description="点击上方按钮进行签到" />
            )}
          </>
        )}

        {activeTab === 'leave' && (
          <>
            <View className={styles.checkinButton} onClick={handleApplyLeave}>
              <Text>申请请假</Text>
            </View>
            
            {leaves.length > 0 ? (
              <View className={styles.attendanceList}>
                {leaves.map(item => (
                  <View key={item._id} className={styles.attendanceItem}>
                    <View className={styles.attendanceHeader}>
                      <Text className={styles.courseName}>{item.courseName}</Text>
                      <Text className={`${styles.statusBadge} ${styles[item.status]}`}>{getStatusLabel(item.status)}</Text>
                    </View>
                    <View className={styles.attendanceTime}>
                      <Text>请假时间：{item.startTime} ~ {item.endTime}</Text>
                    </View>
                    <View className={styles.attendanceTime} style={{ marginTop: '8rpx' }}>
                      <Text>请假原因：{item.reason}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState title="暂无请假记录" description="点击上方按钮申请请假" />
            )}
          </>
        )}
      </View>
    </View>
  )
}
