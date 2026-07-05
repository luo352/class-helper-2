import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { createLeave } from '@/services/attendance'

export default function LeaveApplyPage() {
  const [courseName, setCourseName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const reasonOptions = ['生病请假', '家中有事', '实习请假', '其他']

  const handleSubmit = async () => {
    if (!courseName || !startTime || !endTime || (!selectedReason && !customReason)) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '提交中...' })
      await createLeave({
        courseId: 'course_temp',
        courseName,
        reason: selectedReason === '其他' ? customReason : selectedReason,
        startTime,
        endTime
      })
      Taro.hideLoading()
      Taro.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (err) {
      Taro.hideLoading()
      console.error('[LeaveApplyPage] handleSubmit:', err)
      Taro.showToast({ title: '提交失败', icon: 'none' })
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>请假信息</Text>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>课程名称</Text>
            <input className={styles.formInput} placeholder="请输入课程名称" value={courseName} onChange={(e: any) => setCourseName(e.detail.value)} />
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>请假时间</Text>
            <View className={styles.pickerRow}>
              <input className={styles.pickerItem} placeholder="开始时间" value={startTime} onChange={(e: any) => setStartTime(e.detail.value)} />
              <input className={styles.pickerItem} placeholder="结束时间" value={endTime} onChange={(e: any) => setEndTime(e.detail.value)} />
            </View>
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>请假原因</Text>
            <View className={styles.reasonOptions}>
              {reasonOptions.map(option => (
                <View
                  key={option}
                  className={`${styles.reasonTag} ${selectedReason === option ? styles.selected : ''}`}
                  onClick={() => setSelectedReason(option)}
                >
                  <Text>{option}</Text>
                </View>
              ))}
            </View>
            {selectedReason === '其他' && (
              <textarea className={styles.formTextarea} placeholder="请输入具体原因" value={customReason} onChange={(e: any) => setCustomReason(e.detail.value)} />
            )}
          </View>
        </View>
      </View>

      <View className={styles.submitButton}>
        <View className={styles.btn} onClick={handleSubmit}>
          <Text>提交申请</Text>
        </View>
      </View>
    </View>
  )
}
