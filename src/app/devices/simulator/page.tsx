'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeviceSimulatorPage() {
  const router = useRouter()
  const [serial, setSerial] = useState('')
  const [lat, setLat] = useState('34.414')
  const [lng, setLng] = useState('115.656')
  const [battery, setBattery] = useState('85')
  const [result, setResult] = useState('')
  const [sending, setSending] = useState(false)

  const randomWalk = () => {
    const newLat = parseFloat(lat) + (Math.random() - 0.5) * 0.01
    const newLng = parseFloat(lng) + (Math.random() - 0.5) * 0.01
    setLat(newLat.toFixed(6))
    setLng(newLng.toFixed(6))
    setBattery(String(Math.max(5, parseInt(battery) - Math.floor(Math.random() * 3))))
  }

  const sendLocation = async () => {
    setSending(true)
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial, lat: parseFloat(lat), lng: parseFloat(lng), battery: parseInt(battery) }),
      })
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e: any) {
      setResult('Error: ' + e.message)
    }
    setSending(false)
  }

  const startAutoSend = () => {
    sendLocation()
    randomWalk()
    const timer = setInterval(() => {
      sendLocation()
      randomWalk()
    }, 5000)
    return () => clearInterval(timer)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">📡 GPS设备模拟器</h1>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        <p className="text-sm text-gray-500">模拟GPS项圈向平台上报位置数据，用于测试追踪功能。</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">设备序列号</label>
          <input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="COL-XXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-400" />
          <p className="text-xs text-gray-400 mt-1">可在 Dashboard → 宠物详情 查看项圈编号</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">纬度</label>
            <input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">经度</label>
            <input value={lng} onChange={(e) => setLng(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">电量 (%)</label>
          <input type="number" value={battery} onChange={(e) => setBattery(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
        </div>

        <div className="flex gap-3">
          <button onClick={sendLocation} disabled={sending || !serial} className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">{sending ? '发送中...' : '📤 发送位置'}</button>
          <button onClick={startAutoSend} disabled={!serial} className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">🔄 自动发送(5s)</button>
        </div>

        <button onClick={randomWalk} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm">🎲 随机移动</button>

        {result && (
          <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-xl whitespace-pre-wrap">{result}</div>
        )}
      </div>
    </div>
  )
}
