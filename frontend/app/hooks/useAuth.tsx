'use client'

import { useSelector } from "react-redux"
import { RootState } from "../state/store"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Params {
  redirectIfAuth?: string
  middleware?: 'admin' | 'doctor' | 'patient'
  children: React.ReactNode
}

export default function UseAuth({ redirectIfAuth, middleware, children }: Params) {
  const { isAdmin, isDoctor, isPatient, loading } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading) return

    const isAuthenticated = isAdmin || isDoctor || isPatient

    if (isAuthenticated) {
      if (
        (middleware === 'admin' && !isAdmin) ||
        (middleware === 'doctor' && !isDoctor) ||
        (middleware === 'patient' && !isPatient)
      ) {
        router.push('/unauthorized')
        return
      }

      if (redirectIfAuth) {
        router.push(redirectIfAuth)
        return
      }
    } else {
      const current = window.location.pathname + window.location.search
      router.push(`/login?redirect=${encodeURIComponent(current)}`)
      return
    }

    setChecked(true)
  }, [loading, isAdmin, isDoctor, isPatient, middleware, redirectIfAuth])

  if (loading || !checked) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
