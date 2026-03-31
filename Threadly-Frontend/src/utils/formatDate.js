export function formatDate(dateStr) {
  const date = new Date(dateStr), now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return diff + 's'
  if (diff < 3600) return Math.floor(diff/60) + 'm'
  if (diff < 86400) return Math.floor(diff/3600) + 'h'
  if (diff < 604800) return Math.floor(diff/86400) + 'd'
  return date.toLocaleDateString('en-US', { month:'short', day:'numeric' })
}
