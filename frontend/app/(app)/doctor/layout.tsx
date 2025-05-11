'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/auth'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { isDoctor, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isDoctor && false) {
      router.push('/not-authorized')
    }
  }, [isDoctor, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default Layout
