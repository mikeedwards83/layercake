export function generateId(name: string) {
  const sanitizedName = name.replace(/\s+/g, '').toLowerCase()
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let randomSuffix = ''

  for (let i = 0; i < 4; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return sanitizedName + randomSuffix
}
