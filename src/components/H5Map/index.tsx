import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface H5MapProps {
  longitude: number
  latitude: number
  markers?: Array<{
    id: number
    longitude: number
    latitude: number
    callout?: {
      content: string
      fontSize?: number
      borderRadius?: number
      bgColor?: string
      color?: string
      padding?: number
    }
  }>
  polyline?: Array<{
    points: Array<{ longitude: number; latitude: number }>
    color?: string
    width?: number
  }>
  onLoad?: () => void
}

export default function H5Map({ longitude, latitude, markers, polyline, onLoad }: H5MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
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
          ctx.setLineDash([])

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
        markers.forEach(marker => {
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
    <View className={styles.mapContainer} ref={mapContainerRef as any}>
      {!mapLoaded && (
        <View className={styles.loading}>
          <Text className={styles.loadingText}>加载地图中...</Text>
        </View>
      )}
    </View>
  )
}