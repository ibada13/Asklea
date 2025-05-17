'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UseAuth from '@/app/hooks/useAuth'

const Layout = ({ children }: { children: React.ReactNode }) => {


  return (
    <UseAuth middleware='doctor'>
    {children}
    </UseAuth>
  )
}

export default Layout
