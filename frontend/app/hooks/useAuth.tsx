'use client'

import { UseAuth } from "../state/AuthProvider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "../(app)/extra/Loading"
interface Params {
  redirectIfAuth?: string
  middleware?: 'admin' | 'doctor' | 'patient'
  children: React.ReactNode
}

export default function Auth({ redirectIfAuth, middleware, children }: Params) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const { role, handleGetUser } = UseAuth()

  useEffect(() => {
    handleGetUser()
  }, [])

  useEffect(() => {
    if (role === undefined) return

    if (role) {
      if (
        (middleware === 'admin' && role !== "ADMIN") ||
        (middleware === 'doctor' && role !== "DOCTOR") ||
        (middleware === 'patient' && role !== "PATIENT")
      ) {
        router.push('/unauthorized')
        return
      }

      if (redirectIfAuth) {
        if (redirectIfAuth === '/byrole') {
          if (role === 'ADMIN') router.push('/admin')
          else if (role === 'DOCTOR') router.push('/doctor')
          else if (role === 'PATIENT') router.push('/patient')
        } else {
          router.push(redirectIfAuth)
        }
        return
      }
    } else {
      const current = window.location.pathname + window.location.search
      if (!window.location.pathname.startsWith('/login')) { 
        router.push(`/login?redirect=${encodeURIComponent(current)}`)
      }
    }

    setChecked(true);
  }, [role, middleware, redirectIfAuth, router])

  if (!checked) return <Loading/>

  return <>{children}</>
}
