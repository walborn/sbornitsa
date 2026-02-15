const formatter = new Intl.DateTimeFormat('ru', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const format = (timestamp: number) => formatter.format(new Date(timestamp))
