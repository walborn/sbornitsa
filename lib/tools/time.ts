const formatter = new Intl.DateTimeFormat('ru', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const format = (timestamp: number) => formatter.format(new Date(timestamp))

const DAY = 24 * 60 * 60 * 1000

export const formatDuration = (timestamp: number) => {
  const days = Math.floor(timestamp / DAY)
  if (days === 1) return '1 день'
  if (days === 2) return '2 дня'
  if (days === 3) return '3 дня'
  if (days === 4) return '4 дня'
  if (days === 5) return '5 дней'
  if (days === 6) return '6 дней'
  if (days === 7) return '7 дней'
  return `${days} дн.`
}

const formatterTime = new Intl.DateTimeFormat('ru', {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'short',
})

export const formatTime = (timestamp: number) => formatterTime.format(new Date(timestamp))

// const formatterDuration = new Intl.DurationFormat('ru', {
//   style: 'narrow', // 'narrow' даст "1 ч 23 мин", но можно получить "1h 23m"
//   hours: 'numeric',
//   minutes: 'numeric',
// })

// export const formatDuration = (start: number, end: number) => {
//   formatterDuration.format(new Date(end - start))
// }

export const formatTimeDuration = (ms: number, locale = 'en') => {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const numberFormatter = new Intl.NumberFormat(locale)
  const parts = []

  if (hours > 0) {
    parts.push(`${numberFormatter.format(hours)}h`)
  }
  if (minutes > 0 || hours === 0) {
    // показываем минуты, даже если 0, когда нет часов
    parts.push(`${numberFormatter.format(minutes)}m`)
  }

  return parts.join(' ')
}
