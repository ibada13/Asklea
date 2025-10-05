'use client'
import NavBar from "@/app/NavBar"
import UseAuth from "@/app/hooks/useAuth"

const Layout = ({ children }: { children: React.ReactNode }) => {
      return (
        <UseAuth middleware='patient'>
          <NavBar/>
        {children}
        </UseAuth>
      )
}

export default Layout