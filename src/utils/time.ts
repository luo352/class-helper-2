export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

export function getDayOfWeek(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

export function getWeekDays(): Date[] {
  const today = new Date()
  const currentDay = today.getDay() || 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - currentDay + 1)
  
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    days.push(date)
  }
  return days
}

export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - startOfYear.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.ceil(diff / oneWeek)
}

export function compareTime(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number)
  const [h2, m2] = time2.split(':').map(Number)
  const t1 = h1 * 60 + m1
  const t2 = h2 * 60 + m2
  return t1 - t2
}

export function isTimeBetween(time: string, startTime: string, endTime: string): boolean {
  return compareTime(time, startTime) >= 0 && compareTime(time, endTime) <= 0
}

export function getTimeDifferenceMinutes(startTime: string, endTime: string): number {
  const [h1, m1] = startTime.split(':').map(Number)
  const [h2, m2] = endTime.split(':').map(Number)
  return (h2 * 60 + m2) - (h1 * 60 + m1)
}
