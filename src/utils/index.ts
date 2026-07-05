export * from './time'
export * from './auth'
export * from './reminder'

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: unknown[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

export function throttle<T extends (...args: unknown[]) => void>(fn: T, limit: number): T {
  let inThrottle = false
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}
