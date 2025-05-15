'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/auth'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { isDoctor ,isAuth, loading ,getUser  } = useAuth()

 useEffect(() => {
  getUser(); 
}, []);

useEffect(() => {
  if (!loading) {
    if (!isAuth) {
      router.push('/login');
    } else if (!isDoctor) {
      router.push('/not-authorized');
    }
  }
}, [isDoctor, isAuth, loading, router]);

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
