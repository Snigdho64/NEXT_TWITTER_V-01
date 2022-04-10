const formatDate = (date: Date) => {
  const secs = (new Date().getTime() - date.getTime()) / 1000
  const { round } = Math
  if (secs < 60) return `${round(secs)} seconds ago`
  if (secs < 60 * 60) return `${round(secs / 60)} minutes ago`
  if (secs < 60 * 60 * 24) return `${round(secs / (60 * 60))} hours ago`
  if (secs < 60 * 60 * 24 * 7) return `${round(secs / (60 * 60 * 24))} days ago`
  if (secs < 60 * 60 * 24 * 7 * 4)
    return `${round(secs / (60 * 60 * 24 * 7))} weeks ago`
  if (secs < 60 * 60 * 24 * 7 * 30)
    return `${round(secs / (60 * 60 * 24 * 30))} months ago`
  return date.toLocaleString('en-US', {
    hour12: true,
    year: 'numeric',
    month: 'long',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
  })
}

export default formatDate
