export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export function generateDeviceSerial(): string {
  return `COL-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export const SHANGQIU_CENTER: [number, number] = [115.656, 34.414]
