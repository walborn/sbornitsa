const formatter = new Intl.DateTimeFormat('ru', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const format = (date: Date) => formatter.format(date)
