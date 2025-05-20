'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Toast() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg')
  const [showMsg, setShowMsg] = useState(false)

  useEffect(() => {
    if (!msg) return

    setShowMsg(true)

    const timeout = setTimeout(() => {
      setShowMsg(false)
      router.replace(location.pathname, { scroll: false })
    }, 5000)

    return () => clearTimeout(timeout)
  }, [msg])

  if (!showMsg || !msg) return null

  return (
    <div
      role="alert"
      onClick={() => {
        setShowMsg(false)
        router.replace(location.pathname, { scroll: false })
      }}
      className="fixed top-6 right-6 z-50 cursor-pointer bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 transition-all duration-300 hover:bg-green-600 select-none"
      title="Click to dismiss"
    >
      <span className="text-sm font-medium">{msg}</span>
    </div>
  )
}
