'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Auth from '@/app/hooks/useAuth'
import NavBar from '@/app/NavBar'
const Layout = ({ children }: { children: React.ReactNode }) => {


  return (
    <Auth middleware='doctor'>
      <NavBar />
    {children}
    </Auth>
  )
}

export default Layout
