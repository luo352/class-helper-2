import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { Classroom } from '@/types'
import { getClassrooms } from '@/services/classroom'

interface Location {
  latitude: number
  longitude: number
}

export default function RoutePage() {
  const [classroom, setClassroom] = useState<string>('')
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [destination, setDestination] = useState<Location | null>(null)
  const [navType, setNavType] = useState<'walk' | 'bike' | 'bus'>('bike')
  const [distance, setDistance] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = (currentPage as any).$page?.options || {}
    setClassroom(decodeURIComponent(options.classroom || ''))
    loadClassrooms()
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (currentLocation && destination) {
      calculateRoute()
    }
  }, [currentLocation, destination, navType])

  const loadClassrooms = async () => {
    try {
      const data = await getClassrooms()
      setClassrooms(data)
      findDestination(data)
    } catch (err) {
      console.error('[RoutePage] loadClassrooms:', err)
      setClassrooms([
        { _id: '1', name: '教学楼A', latitude: 39.9042, longitude: 116.4074, createTime: '' },
        { _id: '2', name: '教学楼B', latitude: 39.9052, longitude: 116.4084, createTime: '' },
        { _id: '3', name: '教学楼C', latitude: 39.9062, longitude: 116.4094, createTime: '' }
      ])
      findDestination([
        { _id: '1', name: '教学楼A', latitude: 39.9042, longitude: 116.4074, createTime: '' },
        { _id: '2', name: '教学楼B', latitude: 39.9052, longitude: 116.4084, createTime: '' },
        { _id: '3', name: '教学楼C', latitude: 39.9062, longitude: 116.4094, createTime: '' }
      ])
    }
  }

  const getCurrentLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        setCurrentLocation({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: (err) => {
        console.error('[RoutePage] getLocation:', err)
        Taro.showModal({
          title: '定位失败',
          content: '无法获取当前位置，将使用默认位置',
          showCancel: false
        })
        setCurrentLocation({
          latitude: 39.9042,
          longitude: 116.4074
        })
      }
    })
  }

  const findDestination = (data: Classroom[]) => {
    if (!classroom) return
    const buildingName = classroom.match(/^[^\d-]+/)?.[0] || classroom
    const found = data.find(c => 
      c.name.includes(buildingName) || buildingName.includes(c.name)
    )
    if (found) {
      setDestination({
        latitude: found.latitude,
        longitude: found.longitude
      })
    } else if (data.length > 0) {
      setDestination({
        latitude: data[0].latitude,
        longitude: data[0].longitude
      })
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const calculateRoute = () => {
    if (!currentLocation || !destination) return
    
    const dist = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      destination.latitude,
      destination.longitude
    )

    const speeds: Record<string, number> = {
      walk: 1.2,
      bike: 3.5,
      bus: 5.0
    }

    const speed = speeds[navType]
    const timeMinutes = Math.round(dist / 1000 / speed * 60)

    if (dist < 1000) {
      setDistance(`${Math.round(dist)} 米`)
    } else {
      setDistance(`${(dist / 1000).toFixed(2)} 公里`)
    }

    if (timeMinutes < 60) {
      setDuration(`${timeMinutes} 分钟`)
    } else {
      const hours = Math.floor(timeMinutes / 60)
      const mins = timeMinutes % 60
      setDuration(`${hours}小时${mins}分钟`)
    }
  }

  const getBuildingName = (classroomName: string) => {
    const match = classroomName.match(/^[^\d-]+/)
    return match ? match[0] : classroomName
  }

  const handleNavigate = () => {
    if (!destination) {
      Taro.showToast({ title: '请先选择目的地', icon: 'none' })
      return
    }

    if (process.env.TARO_ENV === 'h5') {
      const url = `https://maps.google.com/?q=${destination.latitude},${destination.longitude}&z=16`
      window.open(url, '_blank')
    } else {
      Taro.openLocation({
        latitude: destination.latitude,
        longitude: destination.longitude,
        name: classroom || getBuildingName(classroom),
        address: '校园内',
        success: () => {
          console.log('打开地图成功')
        },
        fail: (err) => {
          console.error('[RoutePage] openLocation:', err)
          Taro.showToast({ title: '打开地图失败', icon: 'none' })
        }
      })
    }
  }

  const handleMapLoaded = () => {
    setMapLoaded(true)
  }

  const navItems = [
    { type: 'walk', icon: '🚶', label: '步行', speed: 1.2 },
    { type: 'bike', icon: '🚲', label: '骑行', speed: 3.5 },
    { type: 'bus', icon: '🚌', label: '公交', speed: 5.0 }
  ]

  const markers = currentLocation ? [
    {
      id: 1,
      longitude: currentLocation.longitude,
      latitude: currentLocation.latitude,
      callout: {
        content: '当前位置',
        fontSize: 12,
        borderRadius: 4,
        bgColor: '#FFFFFF',
        padding: 6
      }
    },
    destination && {
      id: 2,
      longitude: destination.longitude,
      latitude: destination.latitude,
      callout: {
        content: classroom || '目的地',
        fontSize: 12,
        borderRadius: 4,
        bgColor: '#4A90D9',
        color: '#FFFFFF',
        padding: 6
      }
    }
  ].filter(Boolean) : []

  const polylines = destination && currentLocation ? [{
    points: [
      { longitude: currentLocation.longitude, latitude: currentLocation.latitude },
      { longitude: destination.longitude, latitude: destination.latitude }
    ],
    color: '#4A90D9',
    width: 4
  }] : []

  return (
    <View className={styles.page}>
      <View className={styles.mapContainer}>
        {currentLocation && (
          <>
            {process.env.TARO_ENV === 'h5' && (
              <View className={styles.map}>
                <H5Map
                  longitude={currentLocation.longitude}
                  latitude={currentLocation.latitude}
                  markers={markers as any}
                  polyline={polylines}
                  onLoad={handleMapLoaded}
                />
              </View>
            )}
            {process.env.TARO_ENV !== 'h5' && (
              <Taro.Map
                className={styles.map}
                longitude={currentLocation.longitude}
                latitude={currentLocation.latitude}
                scale={16}
                showLocation
                showScale
                showCompass
                onLoad={handleMapLoaded}
                markers={markers as any}
                polyline={polylines}
              />
            )}
          </>
        )}
        {!currentLocation && (
          <View className={styles.loadingOverlay}>
            <View className={styles.loadingSpinner}></View>
            <Text className={styles.loadingText}>正在获取位置...</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>目的地信息</Text>
          <View className={styles.infoList}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>教学楼</Text>
              <Text className={styles.infoValue}>{getBuildingName(classroom) || '未指定'}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>教室</Text>
              <Text className={styles.infoValue}>{classroom || '未指定'}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>预计时间</Text>
              <Text className={styles.infoValue}>{duration || '计算中...'}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>距离</Text>
              <Text className={styles.infoValue}>{distance || '计算中...'}</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>导航方式</Text>
          <View className={styles.navTypeList}>
            {navItems.map(item => (
              <View
                key={item.type}
                className={`${styles.navTypeItem} ${navType === item.type ? styles.active : ''}`}
                onClick={() => setNavType(item.type as 'walk' | 'bike' | 'bus')}
              >
                <Text className={styles.navIcon}>{item.icon}</Text>
                <Text className={styles.navLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.navButton} onClick={handleNavigate}>
          <Text>开始导航</Text>
        </View>
      </View>
    </View>
  )
}

function H5Map({ longitude, latitude, markers, polyline, onLoad }: any) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = React.useState(false)

  React.useEffect(() => {
    if (process.env.TARO_ENV !== 'h5') return

    const loadMap = () => {
      const container = mapContainerRef.current
      if (!container) return

      const mapWidth = container.offsetWidth
      const mapHeight = container.offsetHeight

      const canvas = document.createElement('canvas')
      canvas.width = mapWidth
      canvas.height = mapHeight
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      container.innerHTML = ''
      container.appendChild(canvas)

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.fillStyle = '#e8f4fc'
      ctx.fillRect(0, 0, mapWidth, mapHeight)

      ctx.fillStyle = '#d0e8f8'
      for (let i = 0; i < mapWidth; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, mapHeight)
        ctx.strokeStyle = '#b8d4e8'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
      for (let i = 0; i < mapHeight; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(mapWidth, i)
        ctx.strokeStyle = '#b8d4e8'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      const centerX = mapWidth / 2
      const centerY = mapHeight / 2

      ctx.fillStyle = '#4A90D9'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 16, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#4A90D9'
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - 4)
      ctx.lineTo(centerX + 3, centerY + 4)
      ctx.lineTo(centerX - 3, centerY + 4)
      ctx.closePath()
      ctx.fill()

      if (polyline && polyline.length > 0) {
        const points = polyline[0].points
        if (points && points.length >= 2) {
          ctx.strokeStyle = polyline[0].color || '#4A90D9'
          ctx.lineWidth = polyline[0].width || 4
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          ctx.beginPath()
          const startX = centerX - ((longitude - points[0].longitude) * 10000)
          const startY = centerY + ((latitude - points[0].latitude) * 10000)
          ctx.moveTo(startX, startY)

          for (let i = 1; i < points.length; i++) {
            const x = centerX - ((longitude - points[i].longitude) * 10000)
            const y = centerY + ((latitude - points[i].latitude) * 10000)
            ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }

      if (markers && markers.length > 0) {
        markers.forEach((marker: any) => {
          const x = centerX - ((longitude - marker.longitude) * 10000)
          const y = centerY + ((latitude - marker.latitude) * 10000)

          if (marker.id === 1) {
            ctx.fillStyle = '#4A90D9'
            ctx.beginPath()
            ctx.arc(x, y, 14, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#FFFFFF'
            ctx.beginPath()
            ctx.arc(x, y, 7, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#4A90D9'
            ctx.beginPath()
            ctx.moveTo(x, y - 3)
            ctx.lineTo(x + 2, y + 3)
            ctx.lineTo(x - 2, y + 3)
            ctx.closePath()
            ctx.fill()
          } else {
            ctx.fillStyle = '#4A90D9'
            ctx.fillRect(x - 12, y - 20, 24, 24)

            ctx.beginPath()
            ctx.moveTo(x - 12, y + 4)
            ctx.lineTo(x, y + 12)
            ctx.lineTo(x + 12, y + 4)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 12px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('📍', x, y)
          }

          if (marker.callout) {
            const callout = marker.callout
            const textWidth = ctx.measureText(callout.content).width
            const padding = callout.padding || 6
            const borderRadius = callout.borderRadius || 4
            const bgColor = callout.bgColor || '#FFFFFF'
            const color = callout.color || '#333333'
            const fontSize = callout.fontSize || 12

            const boxWidth = textWidth + padding * 2 + 8
            const boxHeight = fontSize + padding * 2 + 4
            const boxX = x - boxWidth / 2
            const boxY = y - 30 - boxHeight

            ctx.fillStyle = bgColor
            ctx.beginPath()
            ctx.roundRect(boxX, boxY, boxWidth, boxHeight, borderRadius)
            ctx.fill()

            ctx.fillStyle = color
            ctx.font = `${fontSize}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(callout.content, x, boxY + boxHeight / 2)
          }
        })
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '12px sans-serif'
      ctx.fillText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 10, mapHeight - 10)

      setMapLoaded(true)
      onLoad?.()
    }

    loadMap()

    window.addEventListener('resize', loadMap)
    return () => window.removeEventListener('resize', loadMap)
  }, [longitude, latitude, markers, polyline, onLoad])

  return (
    <div className="h5-map-container" ref={mapContainerRef}>
      {!mapLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '14px', color: '#999' }}>加载地图中...</span>
        </div>
      )}
    </div>
  )
}